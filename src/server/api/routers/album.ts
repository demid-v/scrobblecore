import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  one: publicProcedure
    .input(z.object({ artistName: z.string(), albumName: z.string() }))
    .query(async ({ input: { artistName, albumName } }) => {
      const searchParams = {
        method: "album.getinfo",
        format: "json",
        artist: artistName,
        album: albumName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };
      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const albumInfo = (await (await fetch(url)).json()).album;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { albumInfo };
    }),
});
