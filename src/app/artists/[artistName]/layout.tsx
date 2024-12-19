import { type Metadata } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const artistName = decodeURIComponent((await params).artistName);

  return {
    title: artistName,
  };
};

export default function ArtistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
