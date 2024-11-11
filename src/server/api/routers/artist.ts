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
    .input(z.object({ artistName: z.string(), limit: z.number().default(50) }))
    .query(async ({ input: { artistName, limit } }) => {
      const searchParams = {
        method: "artist.gettopalbums",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        limit: limit.toString(),
        page: "1",
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const result = (await (await fetch(url)).json()) as unknown;

      const parsedResult = topAlbumsSchema.parse(result);
      const parsedAlbums = parsedResult.topalbums.album ?? [];

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
          artist: albumProps.artist.name,
        };

        return album;
      });

      return albums;
    }),

  topTracks: privateProcedure
    .input(z.object({ artistName: z.string(), limit: z.number().default(50) }))
    .query(async ({ input: { artistName, limit } }) => {
      const searchParams = {
        method: "artist.gettoptracks",
        format: "json",
        autocorrect: "1",
        artist: artistName,
        limit: limit.toString(),
        page: "1",
        api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
      };

      const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
      const rawTracks = (await (await fetch(url)).json()) as unknown;

      const parsedResult = topTracksSchema.parse(rawTracks);
      const parsedTracks = parsedResult.toptracks.track ?? [];

      const tracks = parsedTracks.map((parsedTrack) => {
        const { image: images, ...trackProps } = parsedTrack;

        const image = (() => {
          const image = images.find((image) => image.size === "small")?.[
            "#text"
          ];

          if (typeof image === "undefined" || image === "")
            return "/no-cover.png";

          return image;
        })();

        const track = {
          ...trackProps,
          image,
          artist: trackProps.artist.name,
        };

        return track;
      });

      return tracks;
    }),
});
