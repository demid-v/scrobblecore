"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import ListSkeleton from "~/app/_components/list-skeleton";
import SearchPagination from "~/app/_components/search-pagination";
import Tracks from "~/app/_components/tracks";
import { ScrobbleAllButton } from "~/components/scrobble-button";
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

  const itemsQuery = useQuery({
    queryKey: ["topTracks", "tracks", itemsParams],
    queryFn: () => getTopTracks(itemsParams),
  });

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 flex w-fit items-center gap-x-3">
        <SearchPagination
          query={paginationQuery}
          limit={limit}
          page={page}
          className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
        />
        <ScrobbleAllButton query={itemsQuery}>Scrobble all</ScrobbleAllButton>
      </div>
      <TopTracks limit={limit} />
    </>
  );
};

const TopTracks = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
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

  if (isFetching) return <ListSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { tracks } = data;

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: `/artists/${artistNameParam}/tracks` }}
            className="underline-offset-2 hover:underline"
          >
            Tracks
          </Link>
        </p>
      )}
    </Tracks>
  );
};

export default TracksPage;
