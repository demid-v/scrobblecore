"use client";

import { api } from "~/trpc/react";
import Image from "next/image";

const Album = () => {
  const { data: album } = api.album.one.useQuery({
    artistName: "Vegyn",
    albumName: "Only Diamonds Cut Diamonds",
  });

  const scrobble = api.track.scrobble.useMutation();

  return (
    <div>
      {album && (
        <>
          <Image
            src={album.image[3]?.["#text"] ?? ""}
            alt="Album's image"
            width={300}
            height={300}
          />
          <p>{album.name}</p>
          <ol>
            {album.tracks.track.map((track) => (
              <li key={track.url}>
                <span>
                  {track.name} {track.duration}
                </span>
                <button
                  onClick={() => {
                    scrobble.mutate({
                      artist: album.artist,
                      track: track.name,
                      album: album.name,
                      timestamp: Math.floor(Date.now() / 1000),
                      trackNumber: track["@attr"].rank,
                    });
                  }}
                >
                  Scrobble
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
};

export default Album;
