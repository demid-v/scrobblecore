"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ImageWithFallback from "~/components/image-with-fallback";
import NoArtistImage from "~/components/no-artist-image";
import { getArtists } from "~/lib/queries/artist";

import GridSkeleton from "./grid-skeleton";

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

  if (isFetching) return <GridSkeleton count={limit} hasHeader={isSection} />;
  if (!isSuccess) return null;

  const { artists } = data;

  if (artists.length === 0) {
    return <div className="text-center text-xl font-medium">No artists.</div>;
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
          <div key={name} className="w-full">
            <div className="mb-2">
              <Link href={`/artists/${encodeURIComponent(name)}`}>
                <ImageWithFallback
                  src={image}
                  alt="Artist's image"
                  width={300}
                  height={300}
                  defaultImage={<NoArtistImage className="h-min w-full p-10" />}
                  className="h-full w-full"
                />
              </Link>
            </div>
            <p>{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Artists;
