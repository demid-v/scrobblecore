import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import { type Albums as TAlbums } from "~/trpc/react";

const Albums = async ({
  children,
  albums,
}: {
  children?: React.ReactNode;
  albums: TAlbums;
}) => (
  <section>
    {children}
    <div className="mx-auto grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
      {albums.map(({ name, artist, image }) => (
        <div key={`${name}${artist}`} className="mx-auto">
          <div className="mb-2">
            <Link
              href={`/artists/${encodeURIComponent(artist)}/albums/${encodeURIComponent(name)}`}
            >
              <ImageWithFallback
                src={image}
                alt="Album's cover"
                width={300}
                height={300}
                defaultSrc="/no-cover.png"
                defaultClassName="p-10"
              />
            </Link>
          </div>
          <p className="mb-1 text-sm font-bold">
            <Link href={`/artists/${encodeURIComponent(artist)}`}>
              {artist}
            </Link>
          </p>
          <p>{name}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Albums;
