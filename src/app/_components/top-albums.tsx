"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getTopAlbums } from "~/lib/queries/artist";

import Albums from "./albums";
import GridSkeleton from "./grid-skeleton";

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
