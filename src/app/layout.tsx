import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { type CSSProperties } from "react";

import { SidebarProvider } from "~/components/ui/sidebar";
import { TRPCReactProvider } from "~/trpc/react";

import Header from "./_components/header";
import ResizableHistory from "./_components/resizable-history";
import { MobileSidebar } from "./_components/sidebar";
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
              <MobileSidebar />
              <ResizableHistory>
                <main className="container mx-auto px-11 pb-4">{children}</main>
              </ResizableHistory>
            </SidebarProvider>
          </TRPCReactProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
