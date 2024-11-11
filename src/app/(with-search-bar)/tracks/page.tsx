import SearchTracks from "~/app/_components/search-tracks";

const TracksPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};

  const searchQuery = Array.isArray(q) ? q.at(0) : q;
  const isSearchEmpty =
    typeof searchQuery === "undefined" || searchQuery === "";

  if (isSearchEmpty) return null;

  return <SearchTracks searchQuery={searchQuery} limit={30} />;
};

export default TracksPage;
