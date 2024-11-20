"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Artists from "~/app/_components/artists";
import SearchPagination from "~/app/_components/search-pagination";
import { Skeleton } from "~/components/ui/skeleton";
import { getArtists } from "~/lib/queries/artist";

const limit = 60;

const ArtistsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const artistName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["artists", { artistName, limit }],
    queryFn: () => getArtists({ artistName, limit }),
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
      <Suspense>
        <Artists limit={limit} />
      </Suspense>
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

const ArtistsPage = () => (
  <Suspense>
    <ArtistsPageInner />
  </Suspense>
);

export default ArtistsPage;
