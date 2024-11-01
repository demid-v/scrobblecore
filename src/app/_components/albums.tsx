"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "./search-bar";
import Link from "next/link";

const Albums = () => {
  const searchParams = useSearchParams();
  const albumName = searchParams.get("q")?.toString() ?? "";

  const { data: albums, refetch: fetchAlbum } = api.album.search.useQuery(
    { albumName },
    { enabled: false },
  );

  return (
    <div className="mx-9">
      <div className="mx-auto max-w-7xl pt-6">
        <Suspense>
          <SearchBar fetchAlbum={fetchAlbum} />
        </Suspense>
        {albums && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10 pt-10">
            {albums.map(({ mbid, name, artist, image }) => {
              const imageSrc = image[3]?.["#text"] ?? "";

              const albumParams = {
                ...(mbid !== "" ? { mbid } : {}),
                albumName: name,
                artistName: artist,
              };

              return (
                <div key={`${name}${artist}`}>
                  <Link href={`/album/?${new URLSearchParams(albumParams)}`}>
                    <Image
                      src={imageSrc === "" ? "/no-cover.png" : imageSrc}
                      alt="Album's image"
                      width={300}
                      height={300}
                    />
                  </Link>
                  <p>
                    {artist} - {name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Albums;
