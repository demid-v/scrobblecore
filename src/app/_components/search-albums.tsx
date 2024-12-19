"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getAlbums } from "~/lib/queries/album";

import Albums from "./albums";
import GridSkeleton from "./grid-skeleton";

const SearchAlbumsInner = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const albumName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { albumName, limit, page };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["albums", queryParams],
    queryFn: () => getAlbums(queryParams),
  });

  if (isFetching) return <GridSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { albums } = data;

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: "/albums", query: { q: search } }}
            className="underline-offset-2 hover:underline"
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
