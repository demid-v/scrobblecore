"use client";

import { redirect, useParams } from "next/navigation";

import TopAlbums from "~/app/_components/top-albums";
import TopTracks from "~/app/_components/top-tracks";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

const Artist = () => {
  const artistNameParam = decodeURIComponent(
    useParams<{ artistName: string }>().artistName,
  );

  const {
    data: artist,
    isFetching,
    isSuccess,
  } = api.artist.info.useQuery({ artistName: artistNameParam });

  if (isSuccess && artistNameParam !== artist.name) {
    redirect(`/artists/${artist.name}`);
  }

  return (
    <div>
      {isFetching || !isSuccess ? (
        <Skeleton className="mb-10 h-9 w-48" />
      ) : (
        <div className="text-3xl font-semibold">{artist.name}</div>
      )}
      <div className="mt-10">
        <TopAlbums limit={12} isSection />
        <TopTracks limit={10} isSection />
      </div>
    </div>
  );
};

export default Artist;
