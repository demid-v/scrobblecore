import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { env } from "~/env";

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
      "opensearch:totalResults": z.coerce.number(),
    })
    .optional(),
});

const getAlbums = async ({
  albumName,
  limit = 50,
  page = 1,
}: {
  albumName: string;
  limit?: number;
  page?: number;
}) => {
  const searchParams = {
    method: "album.search",
    format: "json",
    album: albumName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const url = `https://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
  const result = (await (await fetch(url)).json()) as unknown;

  const parsedResult = albumsSchema.parse(result);
  const parsedAlbums = parsedResult.results?.albummatches.album ?? [];

  const albums = parsedAlbums.map((album) => ({
    ...album,
    image: album.image.find((image) => image.size === "extralarge")?.["#text"],
  }));

  const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

  return { albums, total };
};

type GetAlbums = Awaited<ReturnType<typeof getAlbums>>;
type AlbumsResult = UseQueryResult<GetAlbums>;
type Albums = GetAlbums["albums"];

export { getAlbums };
export type { GetAlbums, AlbumsResult, Albums };
