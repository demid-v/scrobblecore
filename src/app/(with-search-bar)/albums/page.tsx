"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchAlbums from "~/app/_components/search-albums";
import SearchPagination from "~/app/_components/search-pagination";
import { getAlbums } from "~/lib/queries/album";

const limit = 60;

const AlbumsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const albumName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { albumName, limit };

  const query = useQuery({
    queryKey: ["albums", queryParams],
    queryFn: () => getAlbums(queryParams),
  });

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-14 z-10 mx-auto w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="mb-6 rounded-sm bg-background px-2 py-0.5 shadow-lg"
        />
      </div>
      <SearchAlbums limit={limit} />
    </>
  );
};

const AlbumsPage = () => (
  <Suspense>
    <AlbumsPageInner />
  </Suspense>
);

export default AlbumsPage;
