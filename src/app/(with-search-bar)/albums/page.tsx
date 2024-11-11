import SearchAlbums from "~/app/_components/search-albums";

const AlbumsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const isSearchEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  if (isSearchEmpty) return null;

  return <SearchAlbums searchQuery={searchQuery} limit={60} />;
};

export default AlbumsPage;
