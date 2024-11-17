"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const limit = 50;

const TracksPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.track.search.useQuery({
    trackName: search,
    limit,
  });

  const {
    data: data2,
    isFetching: isFetching2,
    isSuccess: isSuccess2,
  } = api.track.search.useQuery({
    trackName: search,
    limit,
    page,
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
      {isFetching2 || !isSuccess2 ? (
        <Skeleton className="mx-auto mb-6 h-9 w-28" />
      ) : (
        <ScrobbleButton tracks={data2.tracks} className="mx-auto mb-6 block">
          Scrobble all
        </ScrobbleButton>
      )}
      <SearchTracks limit={limit} />
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

const TracksPage = () => (
  <Suspense>
    <TracksPageInner />
  </Suspense>
);

export default TracksPage;
