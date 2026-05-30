import type { MetadataRoute } from "next";

// PWA web manifest — auto-linked by Next (no metadata.manifest needed).
// Enables "Add to Home Screen" with proper Android icons (incl. maskable).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘 뭐하지 — 참여형 재활 게임 카탈로그",
    short_name: "오늘",
    description: "근거기반 참여형 재활 게임 카탈로그.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#10b981",
    lang: "ko",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
