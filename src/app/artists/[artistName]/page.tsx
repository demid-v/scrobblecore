import { redirect } from "next/navigation";

import TopAlbums from "~/app/_components/top-albums";
import TopTracks from "~/app/_components/top-tracks";
import { api } from "~/trpc/server";

const Artist = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistNameParam = decodeURIComponent((await params).artistName);

  const artist = await api.artist.info({ artistName: artistNameParam });
  const { name: artistName } = artist;

  if (artistNameParam !== artistName) {
    redirect(`/artists/${artistName}`);
  }

  return (
    <div>
      <div className="text-3xl font-semibold">{artistName}</div>
      <div className="mt-10">
        <TopAlbums artistName={artistName} limit={12} isSection />
        <TopTracks artistName={artistName} limit={10} isSection />
      </div>
    </div>
  );
};

export default Artist;
