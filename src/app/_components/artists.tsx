import Link from "next/link";

import ImageWithFallback from "~/components/image-with-fallback";
import { api } from "~/trpc/server";

const Artists = async ({
  search,
  limit,
  page,
  isSection = false,
}: {
  search: string;
  limit: number;
  page?: number;
  isSection?: boolean;
}) => {
  const { artists } = await api.artist.search({
    artistName: search,
    limit,
    page,
  });

  if (artists.length === 0) {
    return <div className="text-center text-xl font-medium">No results.</div>;
  }

  return (
    <section>
      {isSection && (
        <p className="mb-6 mt-10 text-xl">
          <Link
            href={{ pathname: "/artists", query: { q: search } }}
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
              <ImageWithFallback
                src={image}
                alt="Artist's image"
                width={300}
                height={300}
                defaultSrc="/no-artist-image.png"
                defaultClassName="p-10"
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
