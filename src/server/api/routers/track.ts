import crypto from "crypto";
import { z } from "zod";

import { env } from "~/env";
import { lastFmApiPost } from "~/lib/utils";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type RouterInputs } from "~/trpc/react";

const trackRouter = createTRPCRouter({
  scrobble: privateProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          artist: z.string(),
          name: z.string(),
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
        input: tracks,
      }) => {
        const baseParams = {
          method: "track.scrobble",
          api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
          sk: sessionKey,
        };

        const baseParamsMap = new Map(Object.entries(baseParams));

        const params = tracks.reduce((params, trackInfo, index) => {
          const { artist, name, album, timestamp } = trackInfo;

          // Adding trackNumber[i] with index notation gives error 13: Invalid method signature supplied.
          params.set(`artist[${index}]`, artist);
          params.set(`track[${index}]`, name);
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

        const result = await lastFmApiPost(
          new URLSearchParams([...params]).toString(),
        );

        return { result, tracks };
      },
    ),
});

type Scrobble = RouterInputs["track"]["scrobble"];

export default trackRouter;
export type { Scrobble };
