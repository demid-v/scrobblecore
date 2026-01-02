import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { env } from "~/env";

import { lastFmApiGet } from "../utils";

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

const topAlbumsSchema = z.object({
  topalbums: z
    .object({
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
    })
    .optional(),
});

const topTracksSchema = z.object({
  toptracks: z
    .object({
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
    })
    .optional(),
});

const getArtists = async ({
  artistName,
  limit = 50,
  page = 1,
}: {
  artistName: string;
  limit?: number;
  page?: number;
}) => {
  const params = {
    method: "artist.search",
    format: "json",
    artist: artistName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    artistsSchema.parse(json),
  );

  const parsedArtists = parsedResult.results?.artistmatches.artist ?? [];

  const artists = parsedArtists.map((artist) => ({
    ...artist,
    image: artist.image.find((image) => image.size === "extralarge")?.["#text"],
  }));

  const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

  return { artists, total };
};

const getArtist = async ({ artistName }: { artistName: string }) => {
  const params = {
    method: "artist.getinfo",
    format: "json",
    autocorrect: "1",
    artist: artistName,
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    artistInfoSchema.parse(json),
  );

  return parsedResult.artist;
};

const getTopAlbums = async ({
  artistName,
  limit = 50,
  page = 1,
}: {
  artistName: string;
  limit?: number;
  page?: number;
}) => {
  const params = {
    method: "artist.gettopalbums",
    format: "json",
    autocorrect: "1",
    artist: artistName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    topAlbumsSchema.parse(json),
  );

  const parsedAlbums = parsedResult.topalbums?.album ?? [];

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

  const total = parsedResult.topalbums?.["@attr"].total ?? 0;

  return { albums, total };
};

const getTopTracks = async ({
  artistName,
  limit = 50,
  page = 1,
}: {
  artistName: string;
  limit?: number;
  page?: number;
}) => {
  const params = {
    method: "artist.gettoptracks",
    format: "json",
    autocorrect: "1",
    artist: artistName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    topTracksSchema.parse(json),
  );

  const parsedTracks = parsedResult.toptracks?.track ?? [];

  const tracks = parsedTracks.map((parsedTrack) => ({
    ...parsedTrack,
    type: "track" as const,
    image: parsedTrack.image.find((image) => image.size === "small")?.["#text"],
    artist: parsedTrack.artist.name,
  }));

  const total = parsedResult.toptracks?.["@attr"].total ?? 0;

  return { tracks, total };
};

type GetArtists = Awaited<ReturnType<typeof getArtists>>;
type ArtistsResult = UseQueryResult<GetArtists>;
type TopAlbums = Awaited<ReturnType<typeof getTopAlbums>>["albums"];

export { getArtists, getArtist, getTopAlbums, getTopTracks };
export type { GetArtists, ArtistsResult, TopAlbums };
