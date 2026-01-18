import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { env } from "~/env";

import { lastFmApiGet } from "../utils";

const albumTrackSchema = z.object({
  name: z.string(),
  artist: z.object({ name: z.string() }),
  duration: z.number().nullable(),
});

const albumSchema = z.object({
  album: z
    .object({
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
    })
    .optional(),
});

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
                "#text": z.url().or(z.string().max(0)),
              }),
            ),
          }),
        ),
      }),
      "opensearch:totalResults": z.coerce.number(),
    })
    .optional(),
});

const getAlbum = async ({
  albumName,
  artistName,
}: {
  albumName: string;
  artistName: string;
}) => {
  const params = {
    method: "album.getinfo",
    format: "json",
    album: albumName,
    artist: artistName,
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params)
    .then((json) => albumSchema.parse(json))
    .catch(() => null);

  if (!parsedResult?.album) return null;

  const {
    image: images,
    tracks: tracksObj,
    ...albumProps
  } = parsedResult.album ?? {};

  const image = images?.find((image) => image.size === "extralarge")?.["#text"];

  const tracks = (() => {
    if (tracksObj === undefined) return [];

    const tracksProp = tracksObj.track;
    const tracksArray = Array.isArray(tracksProp) ? tracksProp : [tracksProp];

    const tracks = tracksArray.map((track) => ({
      ...track,
      type: "album" as const,
      artist: track.artist.name,
      album: albumName,
    }));

    return tracks;
  })();

  const album = {
    ...albumProps,
    image,
    tracks,
  };

  return album;
};

const getAlbums = async ({
  albumName,
  limit = 50,
  page = 1,
}: {
  albumName: string;
  limit?: number;
  page?: number;
}) => {
  const params = {
    method: "album.search",
    format: "json",
    album: albumName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    albumsSchema.parse(json),
  );

  const parsedAlbums = parsedResult.results?.albummatches.album ?? [];

  const albums = parsedAlbums.map((album) => ({
    ...album,
    image: album.image.find((image) => image.size === "extralarge")?.["#text"],
  }));

  const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

  return { albums, total };
};

type Album = NonNullable<Awaited<ReturnType<typeof getAlbum>>>;
type AlbumTracks = Album["tracks"];

type GetAlbums = Awaited<ReturnType<typeof getAlbums>>;
type AlbumsResult = UseQueryResult<GetAlbums>;
type Albums = GetAlbums["albums"];

export { getAlbum, getAlbums };
export type { Album, AlbumTracks, GetAlbums, AlbumsResult, Albums };
