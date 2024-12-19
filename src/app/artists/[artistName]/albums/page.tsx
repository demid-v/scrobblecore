import SearchPagination, {
  SearchPaginationSuspense,
} from "~/app/_components/search-pagination";
import TopAlbums from "~/app/_components/top-albums";
import { getSearchParams } from "~/lib/utils";
import { api } from "~/trpc/server";

const limit = 60;

const AlbumsPage = async ({
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
      <div className="sticky top-2 z-10 mx-auto mb-8 w-fit">
        <SearchPaginationSuspense search={artistName}>
          <AlbumsPagination artistName={artistName} page={page} limit={limit} />
        </SearchPaginationSuspense>
      </div>
      <TopAlbums artistName={artistName} page={page} limit={limit} />
    </>
  );
};

const AlbumsPagination = async ({
  artistName,
  ...props
}: {
  artistName: string;
  page: number;
  limit: number;
}) => {
  const { total } = await api.artist.topAlbums({ artistName });

  return (
    <SearchPagination
      total={total}
      className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
      {...props}
    />
  );
};

export default AlbumsPage;
