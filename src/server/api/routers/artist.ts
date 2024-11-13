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
      "opensearch:totalResults": z.coerce.number(),
    })
    .optional(),
});

const topAlbumsSchema = z.object({
  topalbums: z.object({
    album: z.array(
      z.object({
        name: z.string(),
        artist: z.object({ name: z.string() }),
        image: z.array(
          z.object({
            size: z.enum(["small", "medium", "large", "extralarge"]),
            "#text": z.string().url().or(z.string().max(0)),
          }),
        ),
      }),
    ),
    "@attr": z.object({
      total: z.coerce.number(),
    }),
  }),
});

const topTracksSchema = z.object({
  toptracks: z.object({
    track: z.array(
      z.object({
        name: z.string(),
        artist: z.object({ name: z.string() }),
        image: z.array(
          z.object({
            size: z.enum(["small", "medium", "large", "extralarge"]),
            "#text": z.string().url().or(z.string().max(0)),
          }),
        ),
      }),
    ),
    "@attr": z.object({
      total: z.coerce.number(),
    }),
  }),
});

const artistInfoSchema = z.object({
  artist: z.object({
    name: z.string(),
    image: z.array(
      z.object({
        size: z.enum(["small", "medium", "large", "extralarge", "mega", ""]),
        "#text": z.string().url().or(z.string().max(0)),
      }),
    ),
  }),
});

export const artistRouter = createTRPCRouter({
  search: privateProcedure
    .input(
      z.object({
        artistName: z.string(),
        limit: z.number().default(50),
        page: z.number().optional().default(1),
      }),
    )
    .query(async ({ input: { artistName: artistName, limit, page } }) => {
      const searchParams = {
        method: "artist.search",
        format: "json",
        artist: artistName,
        limit: limit.toString(),
        page: page.toString(),
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = artistsSchema.parse(result);
      const parsedArtists = parsedResult.results?.artistmatches.artist ?? [];

      const artists = parsedArtists.map((artist) => ({
        ...artist,
        image: artist.image.find((image) => image.size === "extralarge")?.[
          "#text"
        ],
      }));

      const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

      return { artists, total };
    }),

  info: privateProcedure
    .input(z.object({ artistName: z.string() }))
    .query(async ({ input: { artistName } }) => {
      const searchParams = {
        method: "artist.getinfo",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = artistInfoSchema.parse(result);
      const artist = parsedResult.artist;

      return artist;
    }),

  topAlbums: privateProcedure
    .input(
      z.object({
        artistName: z.string(),
        limit: z.number().default(50),
        page: z.number().default(1),
      }),
    )
    .query(async ({ input: { artistName, limit, page } }) => {
      const searchParams = {
        method: "artist.gettopalbums",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        limit: limit.toString(),
        page: page.toString(),
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = topAlbumsSchema.parse(result);
      const parsedAlbums = parsedResult.topalbums.album ?? [];

      const albums = parsedAlbums.map((parsedAlbum) => {
        const { image: images, ...albumProps } = parsedAlbum;

        const image = images.find((image) => image.size === "extralarge")?.[
          "#text"
        ];

        const album = {
          ...albumProps,
          image,
          artist: albumProps.artist.name,
        };

        return album;
      });

      const total = parsedResult.topalbums["@attr"].total;

      return { albums, total };
    }),

  topTracks: privateProcedure
    .input(
      z.object({
        artistName: z.string(),
        limit: z.number().default(50),
        page: z.number().default(1),
      }),
    )
    .query(async ({ input: { artistName, limit, page } }) => {
      const searchParams = {
        method: "artist.gettoptracks",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        limit: limit.toString(),
        page: page.toString(),
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = topTracksSchema.parse(result);
      const parsedTracks = parsedResult.toptracks.track ?? [];

      const tracks = parsedTracks.map((parsedTrack) => ({
        ...parsedTrack,
        image: parsedTrack.image.find((image) => image.size === "small")?.[
          "#text"
        ],
        artist: parsedTrack.artist.name,
      }));

      const total = parsedResult.toptracks["@attr"].total;

      return { tracks, total };
    }),
});
