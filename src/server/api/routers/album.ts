import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const albumsSchema = z.object({
  results: z
    .object({
      albummatches: z.object({
        album: z.array(
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

const albumTrackSchema = z.object({
  name: z.string(),
  artist: z.object({ name: z.string() }),
  duration: z.number().nullable(),
});

const albumSchema = z.object({
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
        track: z.array(albumTrackSchema).or(albumTrackSchema),
      })
      .optional(),
  }),
});

export const albumRouter = createTRPCRouter({
  search: privateProcedure
    .input(z.object({ albumName: z.string(), limit: z.number().default(50) }))
    .query(async ({ input: { albumName, limit } }) => {
      const searchParams = {
        method: "album.search",
        format: "json",
        album: albumName,
        limit: limit.toString(),
        page: "1",
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = albumsSchema.parse(result);
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
      z.object({
        albumName: z.string(),
        artistName: z.string(),
      }),
    )
    .query(async ({ input: { artistName, albumName } }) => {
      const params = {
        method: "album.getinfo",
        format: "json",
        album: albumName,
        artist: artistName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(params)}`;
      const rawAlbum = (await (await fetch(url)).json()) as unknown;

      const parsedAlbum = albumSchema.parse(rawAlbum);

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

        const tracksProp = tracksObj.track;

        const tracksArray = Array.isArray(tracksProp)
          ? tracksProp
          : [tracksProp];

        const tracks = tracksArray.map((track) => ({
          ...track,
          artist: track.artist.name,
        }));

        return tracks;
      })();

      const album = {
        ...albumProps,
        image,
        tracks,
      };

      return album;
    }),
});
