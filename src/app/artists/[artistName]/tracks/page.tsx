import SearchPagination, {
  SearchPaginationSuspense,
} from "~/app/_components/search-pagination";
import TopTracks from "~/app/_components/top-tracks";
import ScrobbleButton, {
  ScrobbleAllButtonSuspense,
} from "~/components/scrobble-button";
import { getSearchParams } from "~/lib/utils";
import { api } from "~/trpc/server";

const limit = 50;

const TracksPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ artistName: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);
  const { page } = getSearchParams(await searchParams);

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 flex w-fit items-center gap-x-3">
        <SearchPaginationSuspense search={artistName}>
          <TracksPagination artistName={artistName} page={page} limit={limit} />
        </SearchPaginationSuspense>
        <ScrobbleAllButtonSuspense search={artistName} page={page}>
          <ScrobbleAllButton artistName={artistName} page={page} limit={limit}>
            Scrobble all
          </ScrobbleAllButton>
        </ScrobbleAllButtonSuspense>
      </div>
      <TopTracks artistName={artistName} page={page} limit={limit} />
    </>
  );
};

const TracksPagination = async ({
  artistName,
  ...props
}: {
  artistName: string;
  page: number;
  limit: number;
}) => {
  const { total } = await api.artist.topTracks({ artistName });

  return (
    <SearchPagination
      total={total}
      className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
      {...props}
    />
  );
};

const ScrobbleAllButton = async ({
  children,
  ...props
}: {
  children: React.ReactNode;
  artistName: string;
  page: number;
  limit: number;
}) => {
  const { tracks } = await api.artist.topTracks(props);

  return <ScrobbleButton tracks={tracks}>{children}</ScrobbleButton>;
};

export default TracksPage;
