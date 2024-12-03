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
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["artists", "artist", "topTracks", { artistName, limit, page }],
    queryFn: () => getTopTracks({ artistName, limit, page }),
  });

  if (isFetching) return <ListSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { tracks } = data;

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: `/artists/${artistName}/tracks` }}
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
