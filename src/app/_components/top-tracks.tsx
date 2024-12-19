import Link from "next/link";
import { Suspense } from "react";

import { api } from "~/trpc/server";

import ListSkeleton from "./list-skeleton";
import Tracks from "./tracks";

const TopTracksInner = async ({
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
  const { tracks } = await api.artist.topTracks({ artistName, limit, page });

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

const TopTracks = (props: {
  artistName: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => (
  <Suspense
    key={JSON.stringify({
      page: props.page,
    })}
    fallback={<ListSkeleton count={props.limit} hasHeader={props.isSection} />}
  >
    <TopTracksInner {...props} />
  </Suspense>
);

export default TopTracks;
