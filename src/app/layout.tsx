import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/header";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import HistorySidebar from "./_components/history-sidebar";
import { type CSSProperties } from "react";

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
              <SidebarTrigger className="fixed ml-[0.25rem] mt-14" />
            </div>
            <main className="mx-9 mt-12 w-full pb-8">{children}</main>
          </SidebarProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
