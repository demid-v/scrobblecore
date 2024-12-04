"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { getTracks } from "~/lib/queries/track";

const limit = 50;

const TracksPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const trackName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const paginationParams = { trackName, limit };

  const paginationQuery = useQuery({
    queryKey: ["tracks", paginationParams],
    queryFn: () => getTracks(paginationParams),
  });

  const itemsParams = { ...paginationParams, page };

  const itemsQuery = useQuery({
    queryKey: ["tracks", itemsParams],
    queryFn: () => getTracks(itemsParams),
  });

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-14 mx-auto flex w-fit items-center gap-3">
        {paginationQuery.isFetching || !paginationQuery.isSuccess ? (
          <Skeleton className="mb-6 h-10 w-[480px]" />
        ) : (
          <SearchPagination
            total={paginationQuery.data.total}
            limit={limit}
            page={page}
            className="mb-6 rounded-sm bg-background px-2 py-0.5 shadow-lg"
          />
        )}
        {itemsQuery.isFetching || !itemsQuery.isSuccess ? (
          <Skeleton className="mx-auto mb-6 h-9 w-28" />
        ) : (
          <ScrobbleButton
            tracks={itemsQuery.data.tracks}
            className="mb-6 shadow-lg"
          >
            Scrobble all
          </ScrobbleButton>
        )}
      </div>
      <SearchTracks limit={limit} />
    </>
  );
};

const TracksPage = () => (
  <Suspense>
    <TracksPageInner />
  </Suspense>
);

export default TracksPage;
