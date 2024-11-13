import SearchPagination from "~/app/_components/search-pagination";
import TopTracks from "~/app/_components/top-tracks";
import ScrobbleButton from "~/components/scrobble-button";
import { api } from "~/trpc/server";

const TracksPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ artistName: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);
  const { page: pageQuery } = (await searchParams) ?? {};

  const flatPage = Array.isArray(pageQuery) ? pageQuery.at(0) : pageQuery;
  const page = typeof flatPage !== "undefined" ? Number(flatPage) : 1;

  const limit = 50;

  const { tracks, total } = await api.artist.topTracks({
    artistName,
    limit,
    page,
  });

  return (
    <section>
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
      <TopTracks artistName={artistName} limit={limit} page={page} />
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mt-6"
      />
    </section>
  );
};

export default TracksPage;
