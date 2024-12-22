"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import { ScrobbleAllButton } from "~/components/scrobble-button";
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

  const tracksQuery = useQuery({
    queryKey: ["tracks", itemsParams],
    queryFn: () => getTracks(itemsParams),
  });

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 flex h-10 w-fit items-center gap-x-3">
        <SearchPagination
          query={paginationQuery}
          limit={limit}
          page={page}
          className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
        />
        <ScrobbleAllButton query={tracksQuery}>Scrobble all</ScrobbleAllButton>
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
