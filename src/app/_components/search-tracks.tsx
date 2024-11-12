import Link from "next/link";

import { api } from "~/trpc/server";

import Tracks from "./tracks";

const SearchTracks = async ({
  searchQuery,
  limit,
  isSection = false,
}: {
  searchQuery: string;
  limit: number;
  isSection?: boolean;
}) => {
  const tracks = await api.track.search({ trackName: searchQuery, limit });

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: "/tracks", query: { q: searchQuery } }}
            className="hover:underline hover:underline-offset-2"
          >
            Tracks
          </Link>
        </p>
      )}
    </Tracks>
  );
};

export default SearchTracks;
