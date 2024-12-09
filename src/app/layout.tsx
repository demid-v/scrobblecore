import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import Header from "./_components/header";
import ResizableHistory from "./_components/resizable-history";
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
            <Header />
            <ResizableHistory>
              <main className="container mx-auto px-11 pb-4">{children}</main>
            </ResizableHistory>
          </TRPCReactProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
