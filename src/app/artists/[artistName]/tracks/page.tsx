"use client";

import { useParams, useSearchParams } from "next/navigation";

import SearchPagination from "~/app/_components/search-pagination";
import TopTracks from "~/app/_components/top-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const limit = 50;

const TracksPage = () => {
  const artistNameParam = useParams<{ artistName: string }>().artistName;
  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.artist.topTracks.useQuery({
    artistName: artistNameParam,
    limit,
  });

  const {
    data: data2,
    isFetching: isFetching2,
    isSuccess: isSuccess2,
  } = api.artist.topTracks.useQuery({
    artistName: artistNameParam,
    limit,
    page,
  });

  return (
    <section>
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
      <TopTracks limit={limit} />

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
    </section>
  );
};

export default TracksPage;
