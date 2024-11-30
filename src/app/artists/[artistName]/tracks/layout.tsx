import { type Metadata } from "next";

import { getArtist } from "~/lib/queries/artist";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);
  const artist = await getArtist({ artistName });

  return {
    title: `Tracks by ${artist.name} | Scrobblecore`,
  };
};

export default function ArtistTracksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
