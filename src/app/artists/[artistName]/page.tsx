import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Albums from "~/app/_components/albums";
import GridSkeleton from "~/app/_components/grid-skeleton";
import ListSkeleton from "~/app/_components/list-skeleton";
import Tracks from "~/app/_components/tracks";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

const albumsLimit = 10;
const tracksLimit = 10;

const ArtistPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return (
    <div>
      <Suspense
        key={artistName}
        fallback={<Skeleton className="mb-10 h-9 w-48" />}
      >
        <Artist artistName={artistName} />
      </Suspense>
      <div className="mt-10">
        <Suspense fallback={<GridSkeleton count={albumsLimit} hasHeader />}>
          <TopAlbums artistName={artistName} />
        </Suspense>
        <Suspense fallback={<ListSkeleton count={tracksLimit} hasHeader />}>
          <TopTracks artistName={artistName} />
        </Suspense>
      </div>
    </div>
  );
};

const Artist = async ({ artistName }: { artistName: string }) => {
  const artist = await api.artist.info({ artistName });
  if (!artist) throw new Error("Artist not found");

  const { name } = artist;

  if (artistName !== name) redirect(`/artists/${name}`);

  return <div className="text-3xl font-semibold">{name}</div>;
};

const TopAlbums = async ({ artistName }: { artistName: string }) => {
  const { albums } = await api.artist.topAlbums({
    artistName,
    limit: albumsLimit,
  });

  return (
    <Albums albums={albums}>
      <p className="mb-6 text-xl">
        <Link
          href={{ pathname: `/artists/${artistName}/albums` }}
          className="underline-offset-4 hover:underline"
        >
          Albums
        </Link>
      </p>
    </Albums>
  );
};

const TopTracks = async ({ artistName }: { artistName: string }) => {
  const { tracks } = await api.artist.topTracks({
    artistName,
    limit: tracksLimit,
  });

  return (
    <Tracks tracks={tracks}>
      <p className="mt-10 mb-6 text-xl">
        <Link
          href={{ pathname: `/artists/${artistName}/tracks` }}
          className="underline-offset-4 hover:underline"
        >
          Tracks
        </Link>
      </p>
    </Tracks>
  );
};

export default ArtistPage;
