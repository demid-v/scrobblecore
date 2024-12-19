import { type Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);

  return {
    title: `Albums by ${artistName} | Scrobblecore`,
  };
};

export default function ArtistAlbumsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
