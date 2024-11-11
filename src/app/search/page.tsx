import SearchBar from "~/app/_components/search-bar";
import Artists from "~/app/_components/artists";
import SearchAlbums from "../_components/search-albums";
import SearchTracks from "../_components/search-tracks";

const SearchResults = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const searchIsEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  return (
    <div>
      <SearchBar />
      {!searchIsEmpty && (
        <div className="mt-10">
          <SearchAlbums searchQuery={searchQuery} limit={12} isSection />
          <Artists searchQuery={searchQuery} limit={12} isSection />
          <SearchTracks searchQuery={searchQuery} limit={10} isSection />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
