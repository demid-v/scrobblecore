import Link from "next/link";

import { api } from "~/trpc/server";

import Tracks from "./tracks";

const TopTracks = async ({
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
  const { tracks } = await api.artist.topTracks({
    artistName,
    limit,
    page,
  });

  return (
    <Tracks tracks={tracks}>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: `/artists/${artistName}/tracks` }}
            className="hover:underline hover:underline-offset-2"
          >
            Tracks
          </Link>
        </p>
      )}
    </Tracks>
  );
};

export default TopTracks;
