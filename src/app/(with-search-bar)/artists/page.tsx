import { Suspense } from "react";

import Artists from "~/app/_components/artists";
import SearchPagination, {
  SearchPaginationSuspense,
} from "~/app/_components/search-pagination";
import { getSearchParams } from "~/lib/utils";
import { api } from "~/trpc/server";

const limit = 60;

const ArtistsPage = async ({
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
          <ArtistsPagination artistName={search} page={page} limit={limit} />
        </SearchPaginationSuspense>
      </div>
      <Suspense>
        <Artists search={search} page={page} limit={limit} />
      </Suspense>
    </>
  );
};

const ArtistsPagination = async ({
  artistName: artistName,
  ...props
}: {
  artistName: string;
  page: number;
  limit: number;
}) => {
  const { total } = await api.artist.search({ artistName });

  return (
    <SearchPagination
      total={total}
      className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
      {...props}
    />
  );
};

export default ArtistsPage;
