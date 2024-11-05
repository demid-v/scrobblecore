import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const artistsSchema = z.object({
  results: z
    .object({
      artistmatches: z.object({
        artist: z.array(
          z.object({
            name: z.string(),
            image: z.array(
              z.object({
                size: z.enum([
                  "small",
                  "medium",
                  "large",
                  "extralarge",
                  "mega",
                ]),
                "#text": z.string().url().or(z.string().max(0)),
              }),
            ),
          }),
        ),
      }),
    })
    .optional(),
});

const artistTrackSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  duration: z.number().nullable(),
  "@attr": z.object({ rank: z.number() }),
});

const artistSchema = z.object({
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
        track: z.array(artistTrackSchema).or(artistTrackSchema),
      })
      .optional(),
  }),
});

export const artistRouter = createTRPCRouter({
  search: privateProcedure
    .input(z.object({ artistName: z.string(), limit: z.number().default(50) }))
    .query(async ({ input: { artistName: artistName, limit } }) => {
      const searchParams = {
        method: "artist.search",
        format: "json",
        artist: artistName,
        limit: limit.toString(),
        page: "1",
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = artistsSchema.parse(result);
      const parsedArtists = parsedResult.results?.artistmatches.artist ?? [];

      const albums = parsedArtists.map((parsedAlbum) => {
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

      const parsedAlbum = artistSchema.parse(rawAlbum);

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
