import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ albumName: z.string() }))
    .query(async ({ input: { albumName } }) => {
      const searchParams = {
        method: "album.search",
        format: "json",
        album: albumName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };
      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;

      const rawAlbum = (await (await fetch(url)).json()) as unknown;
      console.log(rawAlbum);
      const parsedResult = z
        .object({
          results: z.object({
            albummatches: z.object({
              album: z.array(
                z.object({
                  mbid: z.string(),
                  name: z.string(),
                  artist: z.string(),
                  image: z.array(
                    z.object({ size: z.string(), "#text": z.string() }),
                  ),
                }),
              ),
            }),
          }),
        })
        .parse(rawAlbum);
      const albums = parsedResult.results.albummatches.album;

      return albums;
    }),
});
