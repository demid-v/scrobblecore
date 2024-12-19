import { type UseQueryResult } from "@tanstack/react-query";
import { type SetOptional, type Simplify } from "type-fest";
import { z } from "zod";

import { env } from "~/env";
import { type AlbumTracks } from "~/server/api/routers/album";

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

  const url = `https://ws.audioscrobbler.com/2.0/?${new URLSearchParams(searchParams)}`;
  const result = (await (await fetch(url)).json()) as unknown;

  const parsedResult = tracksSchema.parse(result);
  const parsedTracks = parsedResult.results?.trackmatches.track ?? [];

  const tracks = parsedTracks.map((track) => ({
    ...track,
    type: "track" as const,
    image: track.image.find((image) => image.size === "small")?.["#text"],
  }));

  const total = parsedResult.results?.["opensearch:totalResults"] ?? 0;

  return { tracks, total };
};

type GetTracks = Awaited<ReturnType<typeof getTracks>>;
type TracksResult = UseQueryResult<GetTracks>;
type SearchTracks = GetTracks["tracks"];
type Tracks = SearchTracks | AlbumTracks;

type TrackToScrobble = Simplify<
  SetOptional<
    Pick<AlbumTracks[number], "name" | "artist" | "album" | "duration">,
    "album" | "duration"
  > & { id?: string | undefined; date?: number | undefined }
>;

export { getTracks };
export type { GetTracks, TracksResult, SearchTracks, Tracks, TrackToScrobble };
