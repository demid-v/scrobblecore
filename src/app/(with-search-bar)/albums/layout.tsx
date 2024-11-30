import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Albums",
};

export default function AlbumsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
