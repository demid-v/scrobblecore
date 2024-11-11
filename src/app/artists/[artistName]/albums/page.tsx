import TopAlbums from "~/app/_components/top-albums";

const AlbumsPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return <TopAlbums artistName={artistName} limit={60} />;
};

export default AlbumsPage;
