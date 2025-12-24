"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { useIsMobile } from "~/hooks/use-mobile";
import { getTracks } from "~/lib/queries/track";
import { cn } from "~/lib/utils";

const limit = 50;

const TracksPageInner = () => {
  const isMobile = useIsMobile();

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
      <div
        className={cn(
          "sticky top-4 z-10 mx-auto mb-6 flex w-fit items-center gap-x-3",
          isMobile && "flex-col gap-y-2",
        )}
      >
        <SearchPagination
          query={paginationQuery}
          limit={limit}
          page={page}
          className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
        />
        <ScrobbleButton tracks={tracksQuery.data?.tracks}>
          Scrobble all
        </ScrobbleButton>
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
