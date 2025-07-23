import { type Metadata } from "next";

import ArtistsPage from "~/app/_components/artists-page";
import { env } from "~/env";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};
  const search = Array.isArray(q) ? q.at(0) : q;

  return {
    title: search ? `\`${search}\` in Artists` : "Artists",
    alternates: { canonical: `${env.NEXT_PUBLIC_PROD_BASE_URL}/artists` },
  } satisfies Metadata;
};

export default ArtistsPage;
