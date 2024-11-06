import TopTracks from "~/app/_components/top-tracks";

const TracksPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return (
    <div className="mx-auto max-w-7xl pt-6">
      <TopTracks artistName={artistName} limit={50} />
    </div>
  );
};

export default TracksPage;
