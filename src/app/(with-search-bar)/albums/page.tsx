import SearchAlbums from "~/app/_components/search-albums";
import SearchPagination, {
  SearchPaginationSuspense,
} from "~/app/_components/search-pagination";
import { getSearchParams } from "~/lib/utils";
import { api } from "~/trpc/server";

const limit = 60;

const AlbumsPage = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { search, page } = getSearchParams(await searchParams);

  if (search === "") return null;

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 w-fit">
        <SearchPaginationSuspense search={search}>
          <AlbumsPagination albumName={search} page={page} limit={limit} />
        </SearchPaginationSuspense>
      </div>
      <SearchAlbums search={search} page={page} limit={limit} />
    </>
  );
};

const AlbumsPagination = async ({
  albumName,
  ...props
}: {
  albumName: string;
  page: number;
  limit: number;
}) => {
  const { total } = await api.album.search({ albumName });

  return (
    <SearchPagination
      total={total}
      className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
      {...props}
    />
  );
};

export default AlbumsPage;
