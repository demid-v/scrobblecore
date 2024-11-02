import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  search: privateProcedure
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

      const parsedResult = z
        .object({
          results: z
            .object({
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
            })
            .optional(),
        })
        .parse(rawAlbum);

      const albums = parsedResult.results?.albummatches.album ?? [];

      return albums;
    }),

  one: privateProcedure
    .input(
      z.object({ term: z.literal("mbid"), mbid: z.string() }).or(
        z.object({
          term: z.literal("names"),
          albumName: z.string(),
          artistName: z.string(),
        }),
      ),
    )
    .query(async ({ input }) => {
      const searchParams = {
        method: "album.getinfo",
        format: "json",
        ...(input.term === "mbid"
          ? { mbid: input.mbid }
          : { album: input.albumName, artist: input.artistName }),
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
            tracks: z
              .object({
                track: z.array(
                  z.object({
                    name: z.string(),
                    url: z.string(),
                    duration: z.number().nullable(),
                    "@attr": z.object({ rank: z.number() }),
                  }),
                ),
              })
              .optional(),
          }),
        })
        .parse(rawAlbum);

      const albumProp = parsedAlbum.album;
      const { tracks, ...albumProps } = albumProp;
      const album = {
        ...albumProps,
        ...(typeof tracks !== "undefined" ? { tracks: tracks.track } : {}),
      };

      return album;
    }),
});
