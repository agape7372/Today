"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { useApplyFontScale } from "@/lib/settings";

function FontScaleApplier() {
  useApplyFontScale();
  return null;
}

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <FontScaleApplier />
      {children}
    </NextThemesProvider>
  );
}
