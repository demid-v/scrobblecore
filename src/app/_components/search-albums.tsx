"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getAlbums } from "~/lib/queries/album";

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
  const albumName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["albums", { albumName, limit, page }],
    queryFn: () => getAlbums({ albumName, limit, page }),
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
