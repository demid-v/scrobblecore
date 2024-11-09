"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
  const scrobble = api.track.scrobble.useMutation();

  return (
    <div className="px-9">
      <div className="mx-auto max-w-7xl pt-6">
        {album && (
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
            <Button
              className="mt-3"
              onClick={() => {
                const tracksToScrobble = album.tracks.map((track) => ({
                  track: track.name,
                  artist: album.artist,
                  album: album.name,
                  timestamp: Math.floor(Date.now() / 1000),
                  trackNumber: track.rank,
                }));

                scrobble.mutate(tracksToScrobble);
              }}
            >
              Scrobble album
            </Button>
            <ol className="mx-auto max-w-lg pt-10">
              {album.tracks.map((track) => (
                <li
                  key={track.rank}
                  className="flex items-center justify-between px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
                >
                  <span>{track.name}</span>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      scrobble.mutate([
                        {
                          track: track.name,
                          artist: album.artist,
                          album: album.name,
                          timestamp: Math.floor(Date.now() / 1000),
                        },
                      ]);
                    }}
                  >
                    Scrobble
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

const AlbumWithSuspense = () => (
  <Suspense>
    <Album />
  </Suspense>
);

export default AlbumWithSuspense;
