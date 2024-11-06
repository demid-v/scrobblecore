import SearchBar from "~/app/_components/search-bar";
import Artists from "~/app/_components/artists";

const ArtistsPage = async ({
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
      {!isSearchEmpty && <Artists searchQuery={searchQuery} limit={50} />}
    </div>
  );
};

export default ArtistsPage;
