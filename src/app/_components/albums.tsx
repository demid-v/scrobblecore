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

  const { data: albums } = api.album.search.useQuery(
    { albumName },
    { enabled: albumName !== "" },
  );

  return (
    <div className="mx-auto max-w-7xl pt-6">
      <Suspense>
        <SearchBar />
      </Suspense>
      {albums && albums.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10 pt-10">
          {albums.map(({ mbid, name, artist, image }) => {
            const key = mbid !== "" ? mbid : `${name}${artist}`;

            const albumParams = {
              ...(mbid !== ""
                ? { mbid }
                : { albumName: name, artistName: artist }),
            };

            return (
              <div key={key}>
                <Link href={`/album/?${new URLSearchParams(albumParams)}`}>
                  <Image
                    src={image}
                    alt="Album's cover"
                    width={300}
                    height={300}
                  />
                </Link>
                <p className="mt-2">
                  {artist} - {name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Albums;
