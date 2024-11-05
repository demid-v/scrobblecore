import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/header";

export const metadata: Metadata = {
  title: "Scrobblecore",
  description: "A better scrobbler.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Header />
          <main className="mx-9 pb-8 pt-12">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
