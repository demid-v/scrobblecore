import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import crypto from "crypto";

const tracksSchema = z.object({
  results: z
    .object({
      trackmatches: z.object({
        track: z.array(
          z.object({
            name: z.string(),
            artist: z.string(),
            image: z.array(
              z.object({
                size: z.enum(["small", "medium", "large", "extralarge"]),
                "#text": z.string().url().or(z.string().max(0)),
              }),
            ),
          }),
        ),
      }),
    })
    .optional(),
});

export const trackRouter = createTRPCRouter({
  search: privateProcedure
    .input(z.object({ trackName: z.string(), limit: z.number().default(30) }))
    .query(async ({ input: { trackName, limit } }) => {
      const searchParams = {
        method: "track.search",
        format: "json",
        track: trackName,
        limit: limit.toString(),
        page: "1",
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = tracksSchema.parse(result);
      const parsedTracks = parsedResult.results?.trackmatches.track ?? [];

      const tracks = parsedTracks.map((parsedTrack) => {
        const { image: images, ...trackProps } = parsedTrack;

        const image = (() => {
          const image = images.find((image) => image.size === "small")?.[
            "#text"
          ];

          if (typeof image === "undefined" || image === "")
            return "/no-cover.png";

          return image;
        })();

        const track = {
          ...trackProps,
          image,
        };

        return track;
      });

      return tracks;
    }),

  scrobble: privateProcedure
    .input(
      z.array(
        z.object({
          artist: z.string(),
          track: z.string(),
          album: z.string().optional(),
          timestamp: z.number(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: {
          session: { sessionKey },
        },
        input: tracksInfo,
      }) => {
        const baseParams = {
          method: "track.scrobble",
          api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
          sk: sessionKey,
        };

        const baseParamsMap = new Map(Object.entries(baseParams));

        const params = tracksInfo.reduce((params, trackInfo, index) => {
          const { artist, track, album, timestamp } = trackInfo;

          // Adding trackNumber[i] with index notation gives error 13: Invalid method signature supplied.
          params.set(`artist[${index}]`, artist);
          params.set(`track[${index}]`, track);
          params.set(`timestamp[${index}]`, timestamp.toString());

          if (typeof album !== "undefined") {
            params.set(`album[${index}]`, album);
          }

          params.set(`chosenByUser[${index}]`, "1");

          return params;
        }, baseParamsMap);

        const sigParamsString = [...params]
          .sort((a, b) => a[0].localeCompare(b[0], "en"))
          .reduce((acc, [key, value]) => `${acc}${key}${value}`, "");

        const encodedSigParamsString = Buffer.from(
          `${sigParamsString}${env.LASTFM_SHARED_SECRET}`,
          "utf-8",
        ).toString("utf-8");

        const apiSig = crypto
          .createHash("md5")
          .update(encodedSigParamsString)
          .digest("hex");

        params.set("api_sig", apiSig);

        const urlSearchParams = new URLSearchParams([...params]);

        const result = await (
          await fetch("http://ws.audioscrobbler.com/2.0/", {
            method: "POST",
            body: urlSearchParams,
          })
        ).text();

        return result;
      },
    ),
});
