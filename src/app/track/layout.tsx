import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Track",
};

export default function TrackLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
