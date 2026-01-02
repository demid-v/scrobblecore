import { type Metadata } from "next";

import AlbumsPage from "~/app/_components/albums-page";
import { getBaseUrl } from "~/lib/utils";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { q } = (await searchParams) ?? {};
  const search = Array.isArray(q) ? q.at(0) : q;

  return {
    title: search ? `"${search}" in Albums` : "Albums",
    alternates: { canonical: `${getBaseUrl()}/albums` },
  } satisfies Metadata;
};

export default AlbumsPage;
