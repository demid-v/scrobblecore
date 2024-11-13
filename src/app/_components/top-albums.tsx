import Link from "next/link";

import { api } from "~/trpc/server";

import Albums from "./albums";

const TopAlbums = async ({
  artistName,
  limit,
  page,
  isSection = false,
}: {
  artistName: string;
  limit: number;
  page?: number;
  isSection?: boolean;
}) => {
  const { albums } = await api.artist.topAlbums({
    artistName,
    limit,
    page,
  });

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

export default TopAlbums;
