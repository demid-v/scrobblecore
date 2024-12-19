import Artists from "~/app/_components/artists";
import SearchAlbums from "~/app/_components/search-albums";
import SearchTracks from "~/app/_components/search-tracks";
import { getSearchParams } from "~/lib/utils";

const SearchResults = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { search, page } = getSearchParams(await searchParams);

  if (search === "") return null;

  return (
    <div className="mt-10">
      <SearchAlbums search={search} page={page} limit={12} isSection />
      <Artists search={search} page={page} limit={12} isSection />
      <SearchTracks search={search} page={page} limit={10} isSection />
    </div>
  );
};

export default SearchResults;
