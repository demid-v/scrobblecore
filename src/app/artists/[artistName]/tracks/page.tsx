import TopTracks from "~/app/_components/top-tracks";

const TracksPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return <TopTracks artistName={artistName} limit={50} />;
};

export default TracksPage;
