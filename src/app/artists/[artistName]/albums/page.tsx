import TopAlbums from "~/app/_components/top-albums";

const AlbumsPage = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) => {
  const artistName = decodeURIComponent((await params).artistName);

  return (
    <div className="mx-auto max-w-7xl pt-6">
      <TopAlbums artistName={artistName} limit={50} />
    </div>
  );
};

export default AlbumsPage;
