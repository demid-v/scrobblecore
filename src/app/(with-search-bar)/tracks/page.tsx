import ScrobbleButton from "~/app/_components/scrobble-button";
import SearchTracks from "~/app/_components/search-tracks";
import { api } from "~/trpc/server";

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

  const limit = 50;
  const tracks = await api.track.search({ trackName: searchQuery, limit });

  return (
    <section>
      <ScrobbleButton tracks={tracks} className="mb-6">
        Scrobble all
      </ScrobbleButton>
      <SearchTracks searchQuery={searchQuery} limit={limit} />
    </section>
  );
};

export default TracksPage;
