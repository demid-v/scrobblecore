import SearchBar from "~/app/_components/search-bar";
import Tracks from "~/app/_components/tracks";

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
    <div className="mx-auto max-w-7xl pt-6">
      <SearchBar />
      {!isSearchEmpty && <Tracks searchQuery={searchQuery} limit={30} />}
    </div>
  );
};

export default TracksPage;
