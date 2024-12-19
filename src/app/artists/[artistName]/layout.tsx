import { type Metadata } from "next";

import { api } from "~/trpc/server";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);
  const artist = await api.artist.info({ artistName });

  return {
    title: artist.name,
  };
};

export default function ArtistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
