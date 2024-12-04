"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import { ScrobbleButtonWithSkeleton } from "~/components/scrobble-button";
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
      <div className="sticky top-14 z-10 mx-auto flex w-fit items-center gap-3">
        <SearchPagination
          query={paginationQuery}
          limit={limit}
          page={page}
          className="mb-6 rounded-sm bg-background px-2 py-0.5 shadow-lg"
        />
        <ScrobbleButtonWithSkeleton
          query={tracksQuery}
          className="mb-6 shadow-lg"
        >
          Scrobble all
        </ScrobbleButtonWithSkeleton>
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
