"use client";

import { api } from "~/trpc/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "./search-bar";

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
            {albums.map((album) => {
              const imageSrc = album.image[3]?.["#text"] ?? "";

              return (
                <div key={`${album.name}${album.artist}`}>
                  <Image
                    src={imageSrc === "" ? "/no-cover.png" : imageSrc}
                    alt="Album's image"
                    width={300}
                    height={300}
                  />
                  <p>
                    {album.artist} - {album.name}
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
