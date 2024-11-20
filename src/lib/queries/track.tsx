import { z } from "zod";

import { env } from "~/env";

import { type AlbumTracks } from "./album";

const tracksSchema = z.object({
  results: z
    .object({
      trackmatches: z.object({
        track: z.array(
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

const getTracks = async ({
  trackName,
  limit = 30,
  page = 1,
}: {
  trackName: string;
  limit?: number;
  page?: number;
}) => {
  const searchParams = {
    method: "track.search",
    format: "json",
    track: trackName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const url = `http://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
  const result = (await (await fetch(url)).json()) as unknown;

  const parsedResult = tracksSchema.parse(result);
  const parsedTracks = parsedResult.results?.trackmatches.track ?? [];

  const tracks = parsedTracks.map((track) => ({
    ...track,
    image: track.image.find((image) => image.size === "small")?.["#text"],
  }));

  const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

  return { tracks, total };
};

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SearchTracks = Awaited<ReturnType<typeof getTracks>>["tracks"];
export type Tracks =
  | PartialBy<SearchTracks[number], "image">[]
  | PartialBy<AlbumTracks[number], "duration">[];

export { getTracks };
