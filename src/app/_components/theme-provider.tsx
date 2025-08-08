"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

const themes = ["light", "dark", "system"] as const;
type Themes = (typeof themes)[number] | undefined;

const ThemeProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    themes={[...themes]}
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);

export type { Themes };
export default ThemeProvider;
