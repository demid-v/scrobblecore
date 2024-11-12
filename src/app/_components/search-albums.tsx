import Link from "next/link";

import { api } from "~/trpc/server";

import Albums from "./albums";

const SearchAlbums = async ({
  searchQuery,
  limit,
  isSection,
}: {
  searchQuery: string;
  limit: number;
  isSection?: boolean;
}) => {
  const albums = await api.album.search({ albumName: searchQuery, limit });

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: "/albums", query: { q: searchQuery } }}
            className="hover:underline hover:underline-offset-2"
          >
            Albums
          </Link>
        </p>
      )}
    </Albums>
  );
};

export default SearchAlbums;
