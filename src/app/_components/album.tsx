"use client";

import { api } from "~/trpc/react";
import Image from "next/image";

const Album = () => {
  const { data: album } = api.album.one.useQuery({
    artistName: "Vegyn",
    albumName: "Only Diamonds Cut Diamonds",
  });

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
                {track.name} {track.duration}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
};

export default Album;
