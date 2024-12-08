"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { getTopTracks } from "~/lib/queries/artist";

import ListSkeleton from "./list-skeleton";
import Tracks from "./tracks";

const TopTracks = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const artistNameParam = useParams<{ artistName: string }>().artistName;
  const artistName = decodeURIComponent(artistNameParam);

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit, page };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["topTracks", "tracks", queryParams],
    queryFn: () => getTopTracks(queryParams),
  });

  if (isFetching) return <ListSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { tracks } = data;

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: `/artists/${artistNameParam}/tracks` }}
            className="hover:underline hover:underline-offset-2"
          >
            Tracks
          </Link>
        </p>
      )}
    </Tracks>
  );
};

export default TopTracks;
