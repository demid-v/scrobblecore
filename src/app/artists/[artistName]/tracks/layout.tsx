import { type Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);

  return {
    title: `Tracks by ${artistName} | Scrobblecore`,
  };
};

export default function ArtistTracksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
