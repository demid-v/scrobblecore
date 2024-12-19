import SearchPagination, {
  SearchPaginationSuspense,
} from "~/app/_components/search-pagination";
import SearchTracks from "~/app/_components/search-tracks";
import ScrobbleButton, {
  ScrobbleAllButtonSuspense,
} from "~/components/scrobble-button";
import { getSearchParams } from "~/lib/utils";
import { api } from "~/trpc/server";

const limit = 50;

const TracksPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { search, page } = getSearchParams(await searchParams);

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 flex h-10 w-fit items-center gap-x-3">
        <SearchPaginationSuspense search={search}>
          <TracksPagination trackName={search} page={page} limit={limit} />
        </SearchPaginationSuspense>
        <ScrobbleAllButtonSuspense search={search} page={page}>
          <ScrobbleAllButton trackName={search} page={page} limit={limit}>
            Scrobble all
          </ScrobbleAllButton>
        </ScrobbleAllButtonSuspense>
      </div>
      <SearchTracks search={search} page={page} limit={limit} />
    </>
  );
};

const TracksPagination = async ({
  trackName,
  ...props
}: {
  trackName: string;
  page: number;
  limit: number;
}) => {
  const { total } = await api.track.search({ trackName });

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
  trackName: string;
  page: number;
  limit: number;
}) => {
  const { tracks } = await api.track.search(props);

  return <ScrobbleButton tracks={tracks}>{children}</ScrobbleButton>;
};

export default TracksPage;
