"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { scrobblesAtom } from "~/lib/store";

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

  const setScrobbles = useSetAtom(scrobblesAtom);

  const scrobble = api.track.scrobble.useMutation({
    onMutate(tracks) {
      const trackForAtom = tracks.map((track) => ({
        id: track.id,
        name: track.track,
        artist: track.artist,
        date: track.timestamp,
        status: "pending" as const,
      }));

      void setScrobbles(trackForAtom);
    },
    onSuccess(data) {
      const trackForAtom = data.tracks.map((track) => ({
        id: track.id,
        name: track.track,
        artist: track.artist,
        date: track.timestamp,
        status: "successful" as const,
      }));

      void setScrobbles(trackForAtom);
    },
  });

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
      <Button
        className="mt-3"
        onClick={() => {
          const tracksToScrobble = album.tracks.map((track, index) => ({
            id: crypto.randomUUID(),
            track: track.name,
            artist: album.artist,
            album: album.name,
            timestamp:
              Math.floor(Date.now() / 1000) -
              (track.duration ?? 3 * 60) * index,
          }));

          scrobble.mutate(tracksToScrobble);
        }}
      >
        Scrobble album
      </Button>
      <ol className="mx-auto pt-10">
        {album.tracks.map((track) => (
          <li
            key={track.rank}
            className="flex items-center justify-between px-2 py-0.5 hover:bg-slate-100 [&:not(:last-child)]:border-b"
          >
            <span>{track.name}</span>
            <Button
              size={"sm"}
              onClick={() => {
                const scrobbles = [
                  {
                    id: crypto.randomUUID(),
                    track: track.name,
                    artist: album.artist,
                    album: album.name,
                    timestamp: Math.floor(Date.now() / 1000),
                  },
                ];

                scrobble.mutate(scrobbles);
              }}
            >
              Scrobble
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
};

const AlbumWithSuspense = () => (
  <Suspense>
    <Album />
  </Suspense>
);

export default AlbumWithSuspense;
