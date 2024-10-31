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

      const rawAlbum = (await (await fetch(url)).json()) as unknown;
      const parsedAlbum = z
        .object({
          album: z.object({
            mbid: z.string(),
            name: z.string(),
            artist: z.string(),
            image: z.array(z.object({ size: z.string(), "#text": z.string() })),
            tracks: z.object({
              track: z.array(
                z.object({
                  name: z.string(),
                  url: z.string(),
                  duration: z.number().nullable(),
                }),
              ),
            }),
          }),
        })
        .parse(rawAlbum);
      const album = parsedAlbum.album;

      return album;
    }),
});
