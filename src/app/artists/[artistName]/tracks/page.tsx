import ScrobbleButton from "~/app/_components/scrobble-button";
import TopTracks from "~/app/_components/top-tracks";
import { api } from "~/trpc/server";

const TracksPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);
  const limit = 50;

  const tracks = await api.artist.topTracks({
    artistName,
    limit,
  });

  return (
    <section>
      <ScrobbleButton tracks={tracks} className="mb-6">
        Scrobble all
      </ScrobbleButton>
      <TopTracks artistName={artistName} limit={limit} />
    </section>
  );
};

export default TracksPage;
