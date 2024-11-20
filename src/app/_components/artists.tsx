"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ImageWithFallback from "~/components/image-with-fallback";
import { getArtists } from "~/lib/queries/artist";

import GridLoading from "./grid-loading";

const Artists = ({
  limit,
  isSection = false,
}: {
  limit: number;
  isSection?: boolean;
}) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("q") ?? "";
  const artistName = search;

  const pageQuery = Number(searchParams.get("page") ?? undefined);
  const page = Number.isNaN(pageQuery) ? 1 : pageQuery;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["artists", { artistName, limit, page }],
    queryFn: () => getArtists({ artistName, limit, page }),
  });

  if (isFetching) return <GridLoading count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { artists } = data;

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
