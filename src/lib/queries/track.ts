import { type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

import { env } from "~/env";

import { lastFmApiGet } from "../utils";
import { AlbumTracks } from "./album";

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
  const params = {
    method: "track.search",
    format: "json",
    track: trackName,
    limit: limit.toString(),
    page: page.toString(),
    api_key: env.NEXT_PUBLIC_LASTFM_API_KEY,
  };

  const parsedResult = await lastFmApiGet(params).then((json) =>
    tracksSchema.parse(json),
  );

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

export { getTracks };
export type { GetTracks, TracksResult, SearchTracks, Tracks };
