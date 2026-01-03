"use client";

import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import NoCover from "~/components/no-cover";
import { useIsMobile } from "~/hooks/use-mobile";
import { type Albums as TAlbums } from "~/lib/queries/album";
import { cn } from "~/lib/utils";

const Albums = ({
  albums,
  children,
}: {
  albums: TAlbums;
  children?: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  if (albums.length === 0) {
    return (
      <div className="mb-6 text-center text-xl font-medium">No albums.</div>
    );
  }

  return (
    <section>
      {children}
      <div
        className={cn(
          "grid-cols-tiles grid gap-x-4 gap-y-6",
          isMobile && "grid-cols-mobile",
        )}
      >
        {albums.map(({ name, artist, image }) => (
          <div
            key={`${name}${artist}`}
            className="group hover:bg-secondary w-full transition-colors"
          >
            <div className="relative mb-2">
              <Link
                href={`/artists/${encodeURIComponent(artist)}/albums/${encodeURIComponent(name)}`}
                className="group-hover:bg-secondary/10 absolute top-0 left-0 h-full w-full transition-colors"
                aria-label="Go to the album's page"
              />
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
                  className="underline-offset-2 hover:underline"
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
