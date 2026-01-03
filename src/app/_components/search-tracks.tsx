"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getTracks } from "~/lib/queries/track";

import ListSkeleton from "./list-skeleton";
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
  const trackName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { trackName, limit, page };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["tracks", queryParams],
    queryFn: () => getTracks(queryParams),
  });

  if (isFetching) return <ListSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { tracks } = data;

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mt-10 mb-6 text-xl">
          <Link
            href={{ pathname: "/tracks", query: { q: search } }}
            className="underline-offset-4 hover:underline"
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
