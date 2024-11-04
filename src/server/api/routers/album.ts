import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const albumsScheme = z.object({
  results: z
    .object({
      albummatches: z.object({
        album: z.array(
          z.object({
            mbid: z.string(),
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

const albumTrackScheme = z.object({
  name: z.string(),
  url: z.string().url(),
  duration: z.number().nullable(),
  "@attr": z.object({ rank: z.number() }),
});

const albumScheme = z.object({
  album: z.object({
    name: z.string(),
    artist: z.string(),
    image: z.array(
      z.object({
        size: z.enum(["small", "medium", "large", "extralarge", "mega", ""]),
        "#text": z.string().url().or(z.string().max(0)),
      }),
    ),
    tracks: z
      .object({
        track: z.array(albumTrackScheme).or(albumTrackScheme),
      })
      .optional(),
  }),
});

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

      const parsedResult = albumsScheme.parse(rawAlbum);
      const parsedAlbums = parsedResult.results?.albummatches.album ?? [];

      const albums = parsedAlbums.map((parsedAlbum) => {
        const { image: images, ...albumProps } = parsedAlbum;

        const image = (() => {
          const image = images.find((image) => image.size === "extralarge")?.[
            "#text"
          ];

          if (typeof image === "undefined" || image === "")
            return "/no-cover.png";

          return image;
        })();

        const album = {
          ...albumProps,
          image,
        };

        return album;
      });

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

      const parsedAlbum = albumScheme.parse(rawAlbum);

      const {
        image: images,
        tracks: tracksObj,
        ...albumProps
      } = parsedAlbum.album;

      const image = (() => {
        const image = images.find((image) => image.size === "extralarge")?.[
          "#text"
        ];

        if (typeof image === "undefined" || image === "")
          return "/no-cover.png";

        return image;
      })();

      const tracks = (() => {
        if (typeof tracksObj === "undefined") return [];

        const tracks = tracksObj.track;

        if (Array.isArray(tracks)) return tracks;
        return [tracks];
      })();

      const album = {
        ...albumProps,
        image,
        tracks,
      };

      return album;
    }),
});
