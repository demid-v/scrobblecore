import { type Metadata } from "next";

import { env } from "~/env";

export const metadata: Metadata = {
  title: "Track",
  alternates: { canonical: `${env.NEXT_PUBLIC_PROD_BASE_URL}/track` },
};

export default function TrackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
