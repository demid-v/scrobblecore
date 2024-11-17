"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import TopAlbums from "~/app/_components/top-albums";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const limit = 60;

const AlbumsPageInner = () => {
  const artistNameParam = useParams<{ artistName: string }>().artistName;
  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.artist.topAlbums.useQuery({
    artistName: artistNameParam,
    limit,
  });

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
      <TopAlbums limit={limit} />
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
