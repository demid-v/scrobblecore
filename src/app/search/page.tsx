import { type Metadata } from "next";

import Artists from "~/app/_components/artists";
import SearchAlbums from "~/app/_components/search-albums";
import SearchTracks from "~/app/_components/search-tracks";
import { env } from "~/env";

import DefaultSearchPage from "../_components/default-search-page";

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
  const isSearchEmpty = search === undefined || search === "";

  if (isSearchEmpty) {
    return <DefaultSearchPage title="Search albums, artists and tracks" />;
  }

  return (
    <div className="mt-10">
      <SearchAlbums limit={10} isSection />
      <Artists limit={10} isSection />
      <SearchTracks limit={10} isSection />
    </div>
  );
};

export default SearchResults;
