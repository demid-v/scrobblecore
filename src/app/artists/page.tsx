import { type Metadata } from "next";

import ArtistsPage from "~/app/_components/artists-page";
import { getBaseUrl } from "~/lib/utils";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};
  const search = Array.isArray(q) ? q.at(0) : q;

  return {
    title: search ? `"${search}" in Artists` : "Artists",
    alternates: { canonical: `${getBaseUrl()}/artists` },
  } satisfies Metadata;
};

export default ArtistsPage;
