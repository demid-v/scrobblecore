import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import crypto from "crypto";

export const trackRouter = createTRPCRouter({
  scrobble: privateProcedure
    .input(
      z.object({
        artist: z.string(),
        track: z.string(),
        album: z.string(),
        timestamp: z.number(),
        trackNumber: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx: {
          session: { sessionKey },
        },
        input: { artist, track, album, timestamp, trackNumber },
      }) => {
        const params = {
          method: "track.scrobble",
          artist,
          track,
          timestamp: String(timestamp),
          album,
          chosenByUser: "1",
          trackNumber: String(trackNumber),
          albumArtist: artist,
          api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
          sk: sessionKey,
        };

        const paramsMap = new Map([...Object.entries(params).sort()]);

        const stringToHash = `${[...paramsMap].reduce(
          (acc, [key, value]) => `${acc}${key}${value}`,
          "",
        )}${env.LASTFM_SHARED_SECRET}`;

        const apiSig = crypto
          .createHash("md5")
          .update(stringToHash)
          .digest("hex");

        paramsMap.set("api_sig", apiSig);

        const searchParams = new URLSearchParams(Object.fromEntries(paramsMap));

        const scrobbleResult = await (
          await fetch("http://ws.audioscrobbler.com/2.0/", {
            method: "POST",
            body: searchParams,
          })
        ).text();

        return scrobbleResult;
      },
    ),
});