import SearchBar from "~/app/_components/search-bar";
import Albums from "~/app/_components/albums";
import Artists from "~/app/_components/artists";
import Tracks from "~/app/_components/tracks";

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
    <div className="mx-auto max-w-7xl pt-6">
      <SearchBar />
      {!searchIsEmpty && (
        <div className="mt-10">
          <Albums searchQuery={searchQuery} limit={10} isSection />
          <Artists searchQuery={searchQuery} limit={10} isSection />
          <Tracks searchQuery={searchQuery} limit={15} isSection />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
