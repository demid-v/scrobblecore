"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { api } from "~/trpc/react";

import Albums from "./albums";
import GridLoading from "./grid-loading";

const TopAlbumsInner = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const artistName = useParams<{ artistName: string }>().artistName;

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = api.artist.topAlbums.useQuery({
    artistName,
    limit,
    page,
  });

  if (isFetching) return <GridLoading count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { albums } = data;

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: `/artists/${artistName}/albums` }}
            className="hover:underline hover:underline-offset-2"
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

export default TopAlbums;
