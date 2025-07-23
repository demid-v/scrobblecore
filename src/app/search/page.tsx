import { type Metadata } from "next";

import Artists from "~/app/_components/artists";
import SearchAlbums from "~/app/_components/search-albums";
import SearchTracks from "~/app/_components/search-tracks";
import { env } from "~/env";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};
  const search = Array.isArray(q) ? q.at(0) : q;

  return {
    title: search ? `\`${search}\` in Search` : "Search",
    alternates: { canonical: `${env.NEXT_PUBLIC_PROD_BASE_URL}/search` },
  } satisfies Metadata;
};

const SearchResults = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const search = Array.isArray(q) ? q.at(0) : q;
  const isSearchEmpty = typeof search === "undefined" || search === "";

  if (isSearchEmpty) return null;

  return (
    <div className="mt-10">
      <SearchAlbums limit={12} isSection />
      <Artists limit={12} isSection />
      <SearchTracks limit={10} isSection />
    </div>
  );
};

export default SearchResults;
