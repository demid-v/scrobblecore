"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Artists from "~/app/_components/artists";
import SearchPagination from "~/app/_components/search-pagination";
import { getArtists } from "~/lib/queries/artist";

import DefaultSearchPage from "./default-search-page";

const limit = 60;

const ArtistsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const artistName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit };

  const query = useQuery({
    queryKey: ["artists", queryParams],
    queryFn: () => getArtists(queryParams),
  });

  if (search === "") return <DefaultSearchPage title="Search artists" />;

  return (
    <>
      <div className="sticky top-4 z-10 mx-auto mb-6 w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="bg-background rounded-sm px-2 py-0.5 shadow-lg dark:shadow-white"
        />
      </div>
      <Suspense>
        <Artists limit={limit} />
      </Suspense>
    </>
  );
};

const ArtistsPage = () => (
  <Suspense>
    <ArtistsPageInner />
  </Suspense>
);

export default ArtistsPage;
