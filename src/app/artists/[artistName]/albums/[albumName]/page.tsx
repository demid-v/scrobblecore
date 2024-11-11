"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Tracks from "~/app/_components/tracks";
import ScrobbleButton from "~/app/_components/scrobble-button";

const Album = () => {
  const { artistName, albumName } = useParams<{
    artistName: string;
    albumName: string;
  }>();

  const params = {
    artistName: decodeURIComponent(artistName),
    albumName: decodeURIComponent(albumName),
  };

  const { data: album } = api.album.one.useQuery(params);

  if (typeof album === "undefined") return null;

  return (
    <div className="w-full text-center">
      <Image
        className="mx-auto"
        src={album.image}
        alt="Album's image"
        width={300}
        height={300}
      />
      <p className="mt-3 font-bold">
        <Link href={`/artists/${encodeURIComponent(album.artist)}`}>
          {album.artist}
        </Link>
      </p>
      <p className="mt-1 text-center text-lg">{album.name}</p>
      <ScrobbleButton tracks={album.tracks} className="mt-3">
        Scrobble album
      </ScrobbleButton>
      <Tracks tracks={album.tracks} className="mt-10" />
    </div>
  );
};

const AlbumWithSuspense = () => (
  <Suspense>
    <Album />
  </Suspense>
);

export default AlbumWithSuspense;
