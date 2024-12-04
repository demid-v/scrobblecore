"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Artists from "~/app/_components/artists";
import SearchPagination from "~/app/_components/search-pagination";
import { getArtists } from "~/lib/queries/artist";

const limit = 60;

const ArtistsPageInner = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const artistName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const query = useQuery({
    queryKey: ["artists", { artistName, limit }],
    queryFn: () => getArtists({ artistName, limit }),
  });

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-14 z-10 mx-auto w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="mb-6 rounded-sm bg-background px-2 py-0.5 shadow-lg"
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
