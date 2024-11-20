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

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["tracks", { trackName, limit }],
    queryFn: () => getTracks({ trackName, limit }),
  });

  const {
    data: data2,
    isFetching: isFetching2,
    isSuccess: isSuccess2,
  } = useQuery({
    queryKey: ["tracks", { trackName, limit, page }],
    queryFn: () => getTracks({ trackName, limit, page }),
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
