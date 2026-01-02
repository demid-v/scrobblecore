import { type Metadata } from "next";

import { getBaseUrl } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Track",
  alternates: { canonical: `${getBaseUrl()}/track` },
};

export default function TrackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
