import Link from "next/link";
import { Suspense } from "react";

import { api } from "~/trpc/server";

import Albums from "./albums";
import GridSkeleton from "./grid-skeleton";

const SearchAlbumsInner = async ({
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
  const { albums } = await api.album.search({ albumName: search, limit, page });

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: "/albums", query: { q: search } }}
            className="hover:underline hover:underline-offset-2"
          >
            Albums
          </Link>
        </p>
      )}
    </Albums>
  );
};

const SearchAlbums = (props: {
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
    fallback={<GridSkeleton count={props.limit} hasHeader={props.isSection} />}
  >
    <SearchAlbumsInner {...props} />
  </Suspense>
);

export default SearchAlbums;
