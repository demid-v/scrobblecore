import Link from "next/link";
import { Suspense } from "react";

import ImageWithFallback from "~/components/image-with-fallback";
import NoArtistImage from "~/components/no-artist-image";
import { api } from "~/trpc/server";

import GridSkeleton from "./grid-skeleton";

const ArtistsInner = async ({
  search,
  page,
  limit,
  isSection = false,
}: {
  search: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => {
  const { artists } = await api.artist.search({
    artistName: search,
    limit,
    page,
  });

  if (artists.length === 0) {
    return (
      <div className="mb-6 text-center text-xl font-medium">No artists.</div>
    );
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
          <div key={name} className="group w-full hover:bg-secondary">
            <div className="relative mb-2">
              <Link
                href={`/artists/${encodeURIComponent(name)}`}
                className="absolute left-0 top-0 h-full w-full transition-colors group-hover:bg-secondary/10"
              ></Link>
              <ImageWithFallback
                src={image}
                alt="Artist's image"
                width={300}
                height={300}
                defaultImage={<NoArtistImage className="h-full w-full p-10" />}
                className="h-full w-full"
              />
            </div>
            <p className="line-clamp-2 px-1.5 pb-1" title={name}>
              {name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Artists = (props: {
  search: string;
  page: number;
  limit: number;
  isSection?: boolean;
}) => (
  <Suspense
    key={JSON.stringify({
      search: props.search,
      page: props.page,
    })}
    fallback={
      <GridSkeleton
        count={props.limit}
        hasHeader={props.isSection}
        areArtists
      />
    }
  >
    <ArtistsInner {...props} />
  </Suspense>
);

export default Artists;
