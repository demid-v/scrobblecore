import Link from "next/link";
import Image from "next/image";
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
      {albums.map(({ name, artist, image }) => (
        <div key={`${name}${artist}`}>
          <Link
            href={`/artists/${encodeURIComponent(artist)}/albums/${encodeURIComponent(name)}`}
          >
            <Image src={image} alt="Album's cover" width={300} height={300} />
          </Link>
          <p className="mt-2">
            {artist} - {name}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default Albums;
