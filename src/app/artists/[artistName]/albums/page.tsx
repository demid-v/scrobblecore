"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import TopAlbums from "~/app/_components/top-albums";
import { Skeleton } from "~/components/ui/skeleton";
import { getTopAlbums } from "~/lib/queries/artist";

const limit = 60;

const AlbumsPageInner = () => {
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["artists", "topAlbums", { artistName, limit }],
    queryFn: () => getTopAlbums({ artistName, limit }),
  });

  return (
    <>
      <div className="sticky top-14 mx-auto mb-6 w-fit">
        {isFetching || !isSuccess ? (
          <Skeleton className="h-10 w-[480px]" />
        ) : (
          <SearchPagination
            total={data.total}
            limit={limit}
            page={page}
            className="rounded-sm bg-background px-2 py-0.5 shadow-lg"
          />
        )}
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
