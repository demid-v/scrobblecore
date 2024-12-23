import { type Metadata } from "next";

import { env } from "~/env";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string; albumName: string }>;
}): Promise<Metadata> => {
  const awaitedParams = await params;
  const artistNameParam = awaitedParams.artistName;
  const albumNameParam = awaitedParams.albumName;

  const artistName = decodeURIComponent(artistNameParam);
  const albumName = decodeURIComponent(albumNameParam);

  return {
    title: `${albumName} by ${artistName} | Scrobblecore`,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_PROD_BASE_URL}/artists/${artistNameParam}/albums/${albumNameParam}`,
    },
  };
};

export default function AlbumLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
