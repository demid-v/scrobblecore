"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

import SearchPagination from "~/app/_components/search-pagination";
import TopTracks from "~/app/_components/top-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { getTopTracks } from "~/lib/queries/artist";

const limit = 50;

const TracksPage = () => {
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["tracks", { artistName, limit }],
    queryFn: () => getTopTracks({ artistName, limit }),
  });

  const {
    data: data2,
    isFetching: isFetching2,
    isSuccess: isSuccess2,
  } = useQuery({
    queryKey: ["tracks", { artistName, limit, page }],
    queryFn: () => getTopTracks({ artistName, limit, page }),
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
