import Artists from "~/app/_components/artists";
import SearchPagination from "~/app/_components/search-pagination";
import { api } from "~/trpc/server";

const ArtistsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q: searchQuery, page: pageQuery } = (await searchParams) ?? {};

  const search = Array.isArray(searchQuery) ? searchQuery.at(0) : searchQuery;
  const isSearchEmpty = typeof search === "undefined" || search === "";

  if (isSearchEmpty) return null;

  const flatPage = Array.isArray(pageQuery) ? pageQuery.at(0) : pageQuery;
  const page = typeof flatPage !== "undefined" ? Number(flatPage) : 1;

  const limit = 60;
  const { total } = await api.artist.search({
    artistName: search,
    limit,
    page,
  });

  return (
    <>
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mb-6"
      />
      <Artists search={search} limit={limit} page={page} />
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mt-6"
      />
    </>
  );
};

export default ArtistsPage;
