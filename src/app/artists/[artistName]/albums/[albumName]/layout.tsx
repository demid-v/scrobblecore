import { type Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string; albumName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);
  const albumName = decodeURIComponent((await params).albumName);

  return {
    title: `${albumName} by ${artistName} | Scrobblecore`,
  };
};

export default function AlbumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
