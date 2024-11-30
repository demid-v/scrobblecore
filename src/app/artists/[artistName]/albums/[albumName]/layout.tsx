import { type Metadata } from "next";

import { getAlbum } from "~/lib/queries/album";
import { getArtist } from "~/lib/queries/artist";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string; albumName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);
  const albumName = decodeURIComponent((await params).albumName);
  const artist = await getArtist({ artistName });
  const album = await getAlbum({ artistName, albumName });

  return {
    title: `${album.name} by ${artist.name} | Scrobblecore`,
  };
};

export default function AlbumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
