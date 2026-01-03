"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getAlbums } from "~/lib/queries/album";

import DefaultSearchPage from "./default-search-page";
import SearchAlbums from "./search-albums";
import SearchPagination from "./search-pagination";

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

  if (search === "") return <DefaultSearchPage title="Search albums" />;

  return (
    <>
      <div className="sticky top-4 z-10 mx-auto mb-6 w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="bg-background rounded-sm px-2 py-0.5 shadow-lg dark:shadow-white"
        />
      </div>
      <SearchAlbums limit={limit} />
    </>
  );
};

const AlbumsPage = () => (
  <Suspense fallback={null}>
    <AlbumsPageInner />
  </Suspense>
);

export default AlbumsPage;
