import Link from "next/link";
import { api } from "~/trpc/server";
import Image from "next/image";

const TopAlbums = async ({
  artistName,
  limit,
  isSection = false,
}: {
  artistName: string;
  limit: number;
  isSection?: boolean;
}) => {
  const albums = await api.artist.topAlbums({
    artistName,
    limit,
  });

  return (
    <section>
      {isSection && (
        <p className="text-xl">
          <Link href={{ pathname: `/artists/${artistName}/albums` }}>
            Albums
          </Link>
        </p>
      )}
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
        {albums.map(({ name, image }) => (
          <div key={`${name}${artistName}`}>
            <Link
              href={`/artists/${encodeURIComponent(artistName)}/albums/${encodeURIComponent(name)}`}
            >
              <Image src={image} alt="Album's cover" width={300} height={300} />
            </Link>
            <p className="mt-2">{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopAlbums;
