"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

import ListSkeleton from "~/app/_components/list-skeleton";
import SearchPagination from "~/app/_components/search-pagination";
import Tracks from "~/app/_components/tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { getTopTracks } from "~/lib/queries/artist";

const limit = 50;

const TracksPage = () => {
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const paginationParams = { artistName, limit };

  const paginationQuery = useQuery({
    queryKey: ["topTracks", "tracks", paginationParams],
    queryFn: () => getTopTracks(paginationParams),
  });

  const itemsParams = { ...paginationParams, page };

  const tracksQuery = useQuery({
    queryKey: ["topTracks", "tracks", itemsParams],
    queryFn: () => getTopTracks(itemsParams),
  });

  return (
    <>
      <div className="sticky top-4 z-10 mx-auto mb-6 flex w-fit items-center gap-x-3">
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
      <TopTracks limit={limit} />
    </>
  );
};

const TopTracks = ({ limit }: { limit: number }) => {
  const artistNameParam = useParams<{ artistName: string }>().artistName;
  const artistName = decodeURIComponent(artistNameParam);

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit, page };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["topTracks", "tracks", queryParams],
    queryFn: () => getTopTracks(queryParams),
  });

  if (isFetching) return <ListSkeleton count={limit} />;
  if (!isSuccess) return null;

  const { tracks } = data;

  return <Tracks tracks={tracks} />;
};

export default TracksPage;
