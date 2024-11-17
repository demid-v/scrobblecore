"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { api } from "~/trpc/react";

import ListLoading from "./list-loading";
import Tracks from "./tracks";

const SearchTracksInner = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.track.search.useQuery({
    trackName: search,
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
            href={{ pathname: "/tracks", query: { q: search } }}
            className="hover:underline hover:underline-offset-2"
          >
            Tracks
          </Link>
        </p>
      )}
    </Tracks>
  );
};

const SearchTracks = (props: { limit: number; isSection?: boolean }) => (
  <Suspense>
    <SearchTracksInner {...props} />
  </Suspense>
);

export default SearchTracks;
