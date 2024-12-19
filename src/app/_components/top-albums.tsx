import Link from "next/link";
import { Suspense } from "react";

import { api } from "~/trpc/server";

import Albums from "./albums";
import GridSkeleton from "./grid-skeleton";

const TopAlbumsInner = async ({
  artistName,
  page,
  limit,
  isSection = false,
}: {
  artistName: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => {
  const { albums } = await api.artist.topAlbums({ artistName, limit, page });

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

const TopAlbums = (props: {
  artistName: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => (
  <Suspense
    key={JSON.stringify({
      page: props.page,
    })}
    fallback={<GridSkeleton count={props.limit} hasHeader={props.isSection} />}
  >
    <TopAlbumsInner {...props} />
  </Suspense>
);

export default TopAlbums;
