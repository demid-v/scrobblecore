import ScrobbleButton from "~/app/_components/scrobble-button";
import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import { api } from "~/trpc/server";

const TracksPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q: searchQuery, page: pageQuery } = (await searchParams) ?? {};

  const search = Array.isArray(searchQuery) ? searchQuery.at(0) : searchQuery;
  const isSearchEmpty = typeof search === "undefined" || search === "";

  if (isSearchEmpty) return null;

  const pageStr = Array.isArray(pageQuery) ? pageQuery.at(0) : pageQuery;
  const page = typeof pageStr !== "undefined" ? Number(pageStr) : 1;

  const limit = 50;
  const { tracks, total } = await api.track.search({
    trackName: search,
    limit,
    page,
  });

  return (
    <>
      <ScrobbleButton tracks={tracks} className="mx-auto mb-6 block">
        Scrobble all
      </ScrobbleButton>
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mb-6"
      />
      <SearchTracks search={search} limit={limit} page={page} />
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mt-6"
      />
    </>
  );
};

export default TracksPage;
