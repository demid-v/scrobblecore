import Link from "next/link";
import { api } from "~/trpc/server";
import Image from "next/image";

const Albums = async ({
  searchQuery,
  limit,
  isSection = false,
}: {
  searchQuery: string;
  limit: number;
  isSection?: boolean;
}) => {
  const albums = await api.album.search({ albumName: searchQuery, limit });

  return (
    <section>
      {isSection && (
        <p className="text-xl">
          <Link
            href={{ pathname: "/search/albums", query: { q: searchQuery } }}
          >
            Albums
          </Link>
        </p>
      )}
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
        {albums.map(({ name, artist, image }) => (
          <div key={`${name}${artist}`}>
            <Link
              href={`/view/${encodeURIComponent(artist)}/${encodeURIComponent(name)}`}
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
};

export default Albums;
