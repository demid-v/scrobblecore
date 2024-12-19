import Link from "next/link";
import { Suspense } from "react";

import { api } from "~/trpc/server";

import ListSkeleton from "./list-skeleton";
import Tracks from "./tracks";

const SearchTracksInner = async ({
  search,
  page,
  limit,
  isSection = false,
}: {
  search: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => {
  const { tracks } = await api.track.search({ trackName: search, limit, page });

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

const SearchTracks = (props: {
  search: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => (
  <Suspense
    key={JSON.stringify({
      search: props.search,
      page: props.page,
    })}
    fallback={<ListSkeleton count={props.limit} hasHeader={props.isSection} />}
  >
    <SearchTracksInner {...props} />
  </Suspense>
);

export default SearchTracks;
