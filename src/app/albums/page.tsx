import SearchBar from "~/app/_components/search-bar";
import SearchAlbums from "../_components/search-albums";

const AlbumsPage = async ({
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
      {!isSearchEmpty && <SearchAlbums searchQuery={searchQuery} limit={60} />}
    </div>
  );
};

export default AlbumsPage;
