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
    title: artistName,
    alternates: {
      canonical: `${getBaseUrl()}/artists/${artistNameParam}`,
    },
  };
};

export default function ArtistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
