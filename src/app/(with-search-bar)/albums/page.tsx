"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchAlbums from "~/app/_components/search-albums";
import SearchPagination from "~/app/_components/search-pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { getAlbums } from "~/lib/queries/album";

const limit = 60;

const AlbumsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const albumName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["albums", { albumName, limit }],
    queryFn: () => getAlbums({ albumName, limit }),
  });

  if (search === "") return null;

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
