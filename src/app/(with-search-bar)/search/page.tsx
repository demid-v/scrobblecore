import Artists from "~/app/_components/artists";
import SearchAlbums from "~/app/_components/search-albums";
import SearchTracks from "~/app/_components/search-tracks";

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
      <SearchAlbums search={search} limit={12} isSection />
      <Artists search={search} limit={12} isSection />
      <SearchTracks search={search} limit={10} isSection />
    </div>
  );
};

export default SearchResults;
