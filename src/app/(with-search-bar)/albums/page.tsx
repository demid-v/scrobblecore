"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchAlbums from "~/app/_components/search-albums";
import SearchPagination from "~/app/_components/search-pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const limit = 60;

const AlbumsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.album.search.useQuery({
    albumName: search,
    limit,
  });

  if (search === "") return null;

  return (
    <>
      {isFetching || !isSuccess ? (
        <Skeleton className="mx-auto mb-6 h-9 w-96" />
      ) : (
        <SearchPagination
          total={data.total}
          limit={limit}
          page={page}
          className="mb-6"
        />
      )}
      <SearchAlbums limit={limit} />
      {isFetching || !isSuccess ? (
        <Skeleton className="mx-auto mt-6 h-9 w-96" />
      ) : (
        <SearchPagination
          total={data.total}
          limit={limit}
          page={page}
          className="mt-6"
        />
      )}
    </>
  );
};

const AlbumsPage = () => (
  <Suspense>
    <AlbumsPageInner />
  </Suspense>
);

export default AlbumsPage;
