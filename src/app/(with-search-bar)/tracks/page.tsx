import SearchPagination from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import ScrobbleButton from "~/components/scrobble-button";
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

  const flatPage = Array.isArray(pageQuery) ? pageQuery.at(0) : pageQuery;
  const page = typeof flatPage !== "undefined" ? Number(flatPage) : 1;

  const limit = 50;

  const { tracks, total } = await api.track.search({
    trackName: search,
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
      {tracks.length > 0 && (
        <ScrobbleButton tracks={tracks} className="mx-auto mb-6 block">
          Scrobble all
        </ScrobbleButton>
      )}
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
