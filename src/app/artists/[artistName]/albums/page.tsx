"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import Albums from "~/app/_components/albums";
import GridSkeleton from "~/app/_components/grid-skeleton";
import SearchPagination from "~/app/_components/search-pagination";
import { getTopAlbums } from "~/lib/queries/artist";

const limit = 60;

const AlbumsPageInner = () => {
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit };

  const query = useQuery({
    queryKey: ["topAlbums", "albums", queryParams],
    queryFn: () => getTopAlbums(queryParams),
  });

  return (
    <>
      <div className="sticky top-2 z-10 mx-auto mb-8 w-fit">
        <SearchPagination
          query={query}
          limit={limit}
          page={page}
          className="rounded-sm bg-background px-2 py-0.5 shadow-lg dark:shadow-white"
        />
      </div>
      <TopAlbums limit={limit} />
    </>
  );
};

const AlbumsPage = () => (
  <Suspense>
    <AlbumsPageInner />
  </Suspense>
);

const TopAlbumsInner = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const artistNameParam = useParams<{ artistName: string }>().artistName;
  const artistName = decodeURIComponent(artistNameParam);

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const queryParams = { artistName, limit, page };

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["topAlbums", "albums", queryParams],
    queryFn: () => getTopAlbums(queryParams),
  });

  if (isFetching) return <GridSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { albums } = data;

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: `/artists/${artistNameParam}/albums` }}
            className="underline-offset-2 hover:underline"
          >
            Albums
          </Link>
        </p>
      )}
    </Albums>
  );
};

const TopAlbums = (props: { limit: number; isSection?: boolean }) => (
  <Suspense>
    <TopAlbumsInner {...props} />
  </Suspense>
);

export default AlbumsPage;
