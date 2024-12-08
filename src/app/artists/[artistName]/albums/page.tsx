"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import TopAlbums from "~/app/_components/top-albums";
import { getTopAlbums } from "~/lib/queries/artist";

const limit = 60;

const AlbumsPageInner = () => {
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit };

  const query = useQuery({
    queryKey: ["topAlbums", "albums", queryParams],
    queryFn: () => getTopAlbums(queryParams),
  });

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
        />
      </div>
      <TopAlbums limit={limit} />
    </>
  );
};

const AlbumsPage = () => (
  <Suspense>
    <AlbumsPageInner />
  </Suspense>
);

export default AlbumsPage;
