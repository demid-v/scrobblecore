"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { api } from "~/trpc/react";

import Albums from "./albums";
import GridLoading from "./grid-loading";

const SearchAlbumsInner = ({
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

  const { data, isFetching, isSuccess } = api.album.search.useQuery({
    albumName: search,
    limit,
    page,
  });

  if (isFetching) return <GridLoading count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { albums } = data;

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

const SearchAlbums = (props: { limit: number; isSection?: boolean }) => (
  <Suspense>
    <SearchAlbumsInner {...props} />
  </Suspense>
);

export default SearchAlbums;
