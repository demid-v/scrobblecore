import { redirect } from "next/navigation";
import { Suspense } from "react";

import TopAlbums from "~/app/_components/top-albums";
import TopTracks from "~/app/_components/top-tracks";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

const ArtistPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return (
    <div>
      <div className="pt-5">
        <Suspense
          key={artistName}
          fallback={<Skeleton className="mb-10 h-9 w-48" />}
        >
          <Artist artistName={artistName} />
        </Suspense>
      </div>
      <div className="mt-10">
        <TopAlbums artistName={artistName} page={1} limit={12} isSection />
        <TopTracks artistName={artistName} page={1} limit={10} isSection />
      </div>
    </div>
  );
};

const Artist = async ({ artistName }: { artistName: string }) => {
  const { name } = await api.artist.info({ artistName });

  if (artistName !== name) redirect(`/artists/${name}`);

  return <div className="text-3xl font-semibold">{name}</div>;
};

export default ArtistPage;
