import { type Metadata } from "next";

import { getBaseUrl } from "~/lib/utils";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ artistName: string }>;
}): Promise<Metadata> => {
  const awaitedParams = await params;
  const artistNameParam = awaitedParams.artistName;

  const artistName = decodeURIComponent(artistNameParam);

  return {
    title: `Albums by ${artistName} | Scrobblecore`,
    alternates: {
      canonical: `${getBaseUrl()}/artists/${artistNameParam}/albums`,
    },
  };
};

export default function ArtistAlbumsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
