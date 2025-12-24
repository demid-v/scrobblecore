import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type CSSProperties } from "react";

import { SidebarProvider } from "~/components/ui/sidebar";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import Header from "./_components/header";
import MobileSidebar from "./_components/mobile-sidebar";
import ResizableHistoryLayout from "./_components/resizable-history-layout";
import ThemeProvider from "./_components/theme-provider";
import Toaster from "./_components/toaster";

export const metadata: Metadata = {
  title: { template: "%s | Scrobblecore", default: "Scrobblecore" },
  description: "A better scrobbler.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  alternates: { canonical: env.NEXT_PUBLIC_PROD_BASE_URL },
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
        <ThemeProvider>
          <TRPCReactProvider>
            <SidebarProvider
              defaultOpen={false}
              style={{ "--sidebar-width": "24rem" } as CSSProperties}
            >
              <Header />
              <MobileSidebar />
              <ResizableHistoryLayout>
                <main className="container relative mx-auto min-h-full px-4 py-4">
                  {children}
                </main>
              </ResizableHistoryLayout>
              <Toaster />
            </SidebarProvider>
          </TRPCReactProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
