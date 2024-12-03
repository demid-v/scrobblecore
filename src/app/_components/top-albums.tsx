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
  const artistName = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const searchParams = useSearchParams();

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["artists", "artist", "topAlbums", { artistName, limit, page }],
    queryFn: () => getTopAlbums({ artistName, limit, page }),
  });

  if (isFetching) return <GridSkeleton count={limit} hasHeader={isSection} />;
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
