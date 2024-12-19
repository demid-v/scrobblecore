import Link from "next/link";
import { Suspense } from "react";

import ListSkeleton from "~/app/_components/list-skeleton";
import Tracks from "~/app/_components/tracks";
import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import ScrobbleButton from "~/components/scrobble-button";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

const AlbumPageInner = async ({
  artistName,
  albumName,
}: {
  artistName: string;
  albumName: string;
}) => {
  const album = await api.album.one({ artistName, albumName });

  return (
    <div className="w-full text-center">
      <ImageWithFallback
        src={album.image}
        alt="Album's image"
        width={300}
        height={300}
        defaultImage={<NoCover className="mx-auto h-full w-full p-10" />}
        priority
        className="mx-auto mb-3"
      />
      <p className="mb-1 font-bold">
        <Link
          href={`/artists/${encodeURIComponent(album.artist ?? artistName)}`}
        >
          {album.artist}
        </Link>
      </p>
      <p className="mb-3 break-all text-center text-lg">{album.name}</p>
      <ScrobbleButton tracks={album.tracks} className="mb-10">
        Scrobble album
      </ScrobbleButton>
      <Tracks tracks={album.tracks} />
    </div>
  );
};

const AlbumPage = async ({
  params,
}: {
  params: Promise<{ artistName: string; albumName: string }>;
}) => {
  const { artistName: artistNameParam, albumName: albumNameParam } =
    await params;

  const artistName = decodeURIComponent(artistNameParam);
  const albumName = decodeURIComponent(albumNameParam);

  return (
    <Suspense
      fallback={
        <div>
          <Skeleton className="mx-auto mb-3 h-[300px] w-[300px]" />
          <Skeleton className="mx-auto mb-3 h-5 w-28" />
          <Skeleton className="mx-auto mb-3 h-6 w-48" />
          <Button className="mx-auto mb-10 block" disabled>
            Scrobble album
          </Button>
          <ListSkeleton count={11} />
        </div>
      }
    >
      <AlbumPageInner artistName={artistName} albumName={albumName} />
    </Suspense>
  );
};

export default AlbumPage;
