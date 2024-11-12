import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type CSSProperties } from "react";

import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";

import Header from "./_components/header";
import HistorySidebar from "./_components/history-sidebar";

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
          <SidebarProvider
            style={{ "--sidebar-width": "24rem" } as CSSProperties}
          >
            <Header />
            <HistorySidebar />
            <div className="h-svh">
              <SidebarTrigger className="fixed ml-2 mt-14" />
            </div>
            <main className="mt-12 w-full px-11 pb-8">
              <div className="container mx-auto h-full pt-2">{children}</div>
            </main>
          </SidebarProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
