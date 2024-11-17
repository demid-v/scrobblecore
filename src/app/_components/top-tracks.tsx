"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { api } from "~/trpc/react";

import ListLoading from "./list-loading";
import Tracks from "./tracks";

const TopTracks = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const artistName = useParams<{ artistName: string }>().artistName;

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.artist.topTracks.useQuery({
    artistName,
    limit,
    page,
  });

  if (isFetching) return <ListLoading count={limit} hasHeader={isSection} />;
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
