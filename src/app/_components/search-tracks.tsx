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

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["tracks", { trackName, limit, page }],
    queryFn: () => getTracks({ trackName, limit, page }),
  });

  if (isFetching) return <ListSkeleton count={limit} hasHeader={isSection} />;
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
