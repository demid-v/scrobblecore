import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import crypto from "crypto";

export const trackRouter = createTRPCRouter({
  scrobble: privateProcedure
    .input(
      z.array(
        z.object({
          artist: z.string(),
          track: z.string(),
          album: z.string(),
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
          params.set(`album[${index}]`, album);
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
