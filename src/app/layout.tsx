import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type CSSProperties } from "react";

import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";

import Header from "./_components/header";
import HistorySidebar from "./_components/history-sidebar";
import ThemeProvider from "./_components/theme-provider";

export const metadata: Metadata = {
  title: { template: "%s | Scrobblecore", default: "Scrobblecore" },
  description: "A better scrobbler.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <SidebarProvider
              defaultOpen={false}
              style={{ "--sidebar-width": "24rem" } as CSSProperties}
            >
              <Header />
              <HistorySidebar />
              <div className="h-svh">
                <SidebarTrigger className="fixed ml-2 mt-14" />
              </div>
              <main className="mt-12 w-full min-w-0 px-11 pb-8">
                <div className="container mx-auto h-full pt-2">{children}</div>
              </main>
            </SidebarProvider>
          </TRPCReactProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
