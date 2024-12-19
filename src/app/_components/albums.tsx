import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import { type Albums as TAlbums } from "~/server/api/routers/album";

const Albums = ({
  albums,
  children,
}: {
  albums: TAlbums;
  children?: React.ReactNode;
}) => {
  if (albums.length === 0) {
    return (
      <div className="mb-6 text-center text-xl font-medium">No albums.</div>
    );
  }

  return (
    <section>
      {children}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
        {albums.map(({ name, artist, image }) => (
          <div
            key={`${name}${artist}`}
            className="group w-full hover:bg-secondary"
          >
            <div className="relative mb-2">
              <Link
                href={`/artists/${encodeURIComponent(artist)}/albums/${encodeURIComponent(name)}`}
                className="absolute left-0 top-0 h-full w-full transition-colors group-hover:bg-secondary/10"
              ></Link>
              <ImageWithFallback
                src={image}
                alt="Album's cover"
                width={300}
                height={300}
                defaultImage={<NoCover className="h-full w-full p-10" />}
                className="h-full w-full"
              />
            </div>
            <div className="px-1.5 pb-1">
              <p className="mb-1.5 line-clamp-2 text-sm font-bold">
                <Link
                  href={`/artists/${encodeURIComponent(artist)}`}
                  className="hover:underline hover:underline-offset-2"
                >
                  {artist}
                </Link>
              </p>
              <p className="line-clamp-2" title={name}>
                {name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Albums;
