import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import { type Albums as TAlbums } from "~/trpc/react";

const Albums = async ({
  children,
  albums,
}: {
  children?: React.ReactNode;
  albums: TAlbums;
}) => {
  if (albums.length === 0) {
    return <div className="text-center text-xl font-medium">No results.</div>;
  }

  return (
    <section>
      {children}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
        {albums.map(({ name, artist, image }) => (
          <div key={`${name}${artist}`} className="w-full">
            <div className="mb-2">
              <Link
                href={`/artists/${encodeURIComponent(artist)}/albums/${encodeURIComponent(name)}`}
              >
                <ImageWithFallback
                  src={image}
                  alt="Album's cover"
                  width={300}
                  height={300}
                  className="h-full w-full"
                  defaultSrc="/no-cover.png"
                  defaultClassName="p-10"
                />
              </Link>
            </div>
            <p className="mb-1 line-clamp-2 text-sm font-bold">
              <Link href={`/artists/${encodeURIComponent(artist)}`}>
                {artist}
              </Link>
            </p>
            <p className="line-clamp-2" title={name}>
              {name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Albums;
