import { type Metadata } from "next";

import TracksPage from "~/app/_components/tracks-page";
import { env } from "~/env";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};
  const search = Array.isArray(q) ? q.at(0) : q;

  return {
    title: search ? `\`${search}\` in Tracks` : "Tracks",
    alternates: { canonical: `${env.NEXT_PUBLIC_PROD_BASE_URL}/tracks` },
  } satisfies Metadata;
};

export default TracksPage;
