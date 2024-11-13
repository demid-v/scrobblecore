import Link from "next/link";

import { api } from "~/trpc/server";

import Albums from "./albums";

const SearchAlbums = async ({
  search,
  limit,
  page,
  isSection,
}: {
  search: string;
  limit: number;
  page?: number;
  isSection?: boolean;
}) => {
  const { albums } = await api.album.search({ albumName: search, limit, page });

  return (
    <Albums albums={albums}>
      {isSection && (
        <p className="mb-6 text-xl">
          <Link
            href={{ pathname: "/albums", query: { q: search } }}
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
