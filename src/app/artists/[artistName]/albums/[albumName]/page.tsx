"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

import ListLoading from "~/app/_components/list-loading";
import Tracks from "~/app/_components/tracks";
import ImageWithFallback from "~/components/image-with-fallback";
import ScrobbleButton from "~/components/scrobble-button";
import { Skeleton } from "~/components/ui/skeleton";
import { getAlbum } from "~/lib/queries/album";

const AlbumPage = () => {
  const params = useParams<{ artistName: string; albumName: string }>();

  const artistName = decodeURIComponent(params.artistName);
  const albumName = decodeURIComponent(params.albumName);

  const {
    data: album,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["albums", "album", { artistName, albumName }],
    queryFn: () => getAlbum({ artistName, albumName }),
  });

  if (isFetching) return <AlbumLoading />;
  if (!isSuccess) return null;

  return (
    <div className="w-full text-center">
      <ImageWithFallback
        src={album.image}
        alt="Album's image"
        width={300}
        height={300}
        defaultSrc="/no-cover.png"
        className="mx-auto"
        defaultClassName="mx-auto p-10"
      />
      <p className="mt-3 font-bold">
        <Link
          href={`/artists/${encodeURIComponent(album.artist ?? artistName)}`}
        >
          {album.artist}
        </Link>
      </p>
      <p className="mt-1 break-all text-center text-lg">{album.name}</p>
      <ScrobbleButton tracks={album.tracks} className="mt-3">
        Scrobble album
      </ScrobbleButton>
      <Tracks tracks={album.tracks} className="mt-10" />
    </div>
  );
};

const AlbumLoading = () => (
  <div>
    <Skeleton className="mx-auto mb-3 h-[300px] w-[300px]" />
    <Skeleton className="mx-auto mb-3 h-5 w-28" />
    <Skeleton className="mx-auto mb-3 h-6 w-48" />
    <Skeleton className="mx-auto mb-10 h-9 w-32" />
    <ListLoading count={12} />
  </div>
);

export default AlbumPage;
