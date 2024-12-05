"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

import SearchPagination from "~/app/_components/search-pagination";
import TopTracks from "~/app/_components/top-tracks";
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
    queryKey: ["tracks", paginationParams],
    queryFn: () => getTopTracks(paginationParams),
  });

  const itemsParams = { ...paginationParams, page };

  const itemsQuery = useQuery({
    queryKey: ["tracks", itemsParams],
    queryFn: () => getTopTracks(itemsParams),
  });

  return (
    <>
      <div className="sticky top-14 z-10 mx-auto flex w-fit items-center gap-3">
        <SearchPagination
          query={paginationQuery}
          limit={limit}
          page={page}
          className="mb-6 rounded-sm bg-background px-2 py-0.5 shadow-lg"
        />
        <ScrobbleAllButton query={itemsQuery} className="mb-6 shadow-lg">
          Scrobble all
        </ScrobbleAllButton>
      </div>
      <TopTracks limit={limit} />
    </>
  );
};

export default TracksPage;
