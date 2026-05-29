import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://today-mwo-hagi.example",
  ),
  title: {
    default: "오늘 뭐하지 — 참여형 재활 게임 카탈로그",
    template: "%s — 오늘 뭐하지",
  },
  description:
    "근거기반 참여형 재활 게임 카탈로그. 뇌졸중·척수손상·파킨슨·노인을 위한 그룹 활동 가이드.",
  keywords: [
    "참여형 재활",
    "그룹치료",
    "재활 게임",
    "노인 운동",
    "뇌졸중 재활",
    "파킨슨 운동",
    "치료사 도구",
  ],
  authors: [{ name: "오늘 뭐하지" }],
  openGraph: {
    title: "오늘 뭐하지 — 참여형 재활 게임 카탈로그",
    description: "치료사가 30초 안에 오늘의 게임을 결정하는 도구.",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
