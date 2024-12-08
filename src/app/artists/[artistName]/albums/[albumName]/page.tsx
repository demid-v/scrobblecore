"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import ListSkeleton from "~/app/_components/list-skeleton";
import Tracks from "~/app/_components/tracks";
import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { getAlbum } from "~/lib/queries/album";

const AlbumPage = () => {
  const params = useParams<{ artistName: string; albumName: string }>();

  const artistName = decodeURIComponent(params.artistName);
  const albumName = decodeURIComponent(params.albumName);

  const queryParams = { artistName, albumName };

  const {
    data: album,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["album", "albums", queryParams],
    queryFn: () => getAlbum(queryParams),
  });

  if (isFetching) return <AlbumSkeleton />;
  if (!isSuccess) return null;

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

const AlbumSkeleton = () => (
  <div>
    <Skeleton className="mx-auto mb-3 h-[300px] w-[300px]" />
    <Skeleton className="mx-auto mb-3 h-5 w-28" />
    <Skeleton className="mx-auto mb-3 h-6 w-48" />
    <Skeleton className="mx-auto mb-10 h-9 w-32" />
    <ListSkeleton count={11} />
  </div>
);

export default AlbumPage;
