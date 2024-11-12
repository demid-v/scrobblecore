import crypto from "crypto";
import { z } from "zod";

import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

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
      "opensearch:totalResults": z.coerce.number(),
    })
    .optional(),
});

export const trackRouter = createTRPCRouter({
  search: privateProcedure
    .input(
      z.object({
        trackName: z.string(),
        limit: z.number().default(30),
        page: z.number().optional().default(1),
      }),
    )
    .query(async ({ input: { trackName, limit, page } }) => {
      const searchParams = {
        method: "track.search",
        format: "json",
        track: trackName,
        limit: limit.toString(),
        page: page.toString(),
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = tracksSchema.parse(result);
      const parsedTracks = parsedResult.results?.trackmatches.track ?? [];

      const tracks = parsedTracks.map((track) => ({
        ...track,
        image: track.image.find((image) => image.size === "small")?.["#text"],
      }));

      const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

      return { tracks, total };
    }),

  scrobble: privateProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          artist: z.string(),
          track: z.string(),
          album: z.string().optional(),
          date: z.number(),
          timestamp: z.number(),
        }),
      ),
    )
    .mutation(
      async ({
        ctx: {
          session: { sessionKey },
        },
        input: tracks,
      }) => {
        const baseParams = {
          method: "track.scrobble",
          api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
          sk: sessionKey,
        };

        const baseParamsMap = new Map(Object.entries(baseParams));

        const params = tracks.reduce((params, trackInfo, index) => {
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
          .sort((a, b) => {
            if (a[0] < b[0]) return -1;
            if (a[0] > b[0]) return 1;
            return 0;
          })
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

        return { result, tracks };
      },
    ),
});
