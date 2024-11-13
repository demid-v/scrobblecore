import SearchPagination from "~/app/_components/search-pagination";
import TopAlbums from "~/app/_components/top-albums";
import { api } from "~/trpc/server";

const AlbumsPage = async ({
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

  const { total } = await api.artist.topAlbums({
    artistName,
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
      <TopAlbums artistName={artistName} limit={60} page={page} />
      <SearchPagination
        total={total}
        limit={limit}
        page={page}
        className="mt-6"
      />
    </>
  );
};

export default AlbumsPage;
