import Image from "next/image";
import Link from "next/link";

import { api } from "~/trpc/server";

const Artists = async ({
  searchQuery,
  limit,
  isSection = false,
}: {
  searchQuery: string;
  limit: number;
  isSection?: boolean;
}) => {
  const artists = await api.artist.search({
    artistName: searchQuery,
    limit,
  });

  return (
    <section>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: "/artists", query: { q: searchQuery } }}
            className="hover:underline hover:underline-offset-2"
          >
            Artists
          </Link>
        </p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6 gap-y-10">
        {artists.map(({ name, image }) => (
          <div key={name}>
            <Link href={`/artists/${encodeURIComponent(name)}`}>
              <Image
                src={image}
                alt="Artist's image"
                width={300}
                height={300}
              />
            </Link>
            <p className="mt-2">{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Artists;
