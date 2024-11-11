import SearchBar from "~/app/_components/search-bar";
import SearchTracks from "../_components/search-tracks";

const TracksPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const isSearchEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  return (
    <div>
      <SearchBar />
      {!isSearchEmpty && <SearchTracks searchQuery={searchQuery} limit={30} />}
    </div>
  );
};

export default TracksPage;
