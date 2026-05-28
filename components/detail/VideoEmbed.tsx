"use client";

import { useEffect, useRef } from "react";
import { Video, Search } from "lucide-react";
import { useVideoOverrides } from "@/lib/video-overrides";

function extractYoutubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]+)/,
  );
  return m ? m[1] : null;
}

function isInstagramUrl(url: string): boolean {
  return /(?:instagram\.com|instagr\.am)\//.test(url);
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    // embed.js를 한 번만 로드 (전역)
    const SRC = "https://www.instagram.com/embed.js";
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    // 다시 process — embed.js가 이미 로드된 경우에도 새 blockquote 처리
    const t = setTimeout(() => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    }, 300);
    return () => clearTimeout(t);
  }, [url]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-white shadow-soft">
      <blockquote
        ref={ref}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          margin: "0 auto",
          maxWidth: "540px",
          minWidth: "300px",
          padding: 0,
          width: "100%",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          Instagram에서 보기
        </a>
      </blockquote>
    </div>
  );
}

export interface VideoEmbedProps {
  slug: string;
  url?: string;
  searchQuery?: string;
}

export function VideoEmbed({ slug, url, searchQuery }: VideoEmbedProps) {
  const { resolve } = useVideoOverrides();
  // 사용자 override가 있으면 우선, 없으면 mdx의 기본값
  const effective = resolve(slug, url);

  if (effective && effective.trim()) {
    const ytId = extractYoutubeId(effective);
    if (ytId) {
      return (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] shadow-soft">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}`}
              title="게임 영상"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      );
    }

    if (isInstagramUrl(effective)) {
      return <InstagramEmbed url={effective} />;
    }
  }

  if (searchQuery) {
    const q = encodeURIComponent(searchQuery);
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${q}`}
        target="_blank"
        rel="noopener noreferrer"
        className="no-print group flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--line)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/30"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Video className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">참고 영상 찾기</p>
          <p className="text-xs text-[var(--fg-muted)]">
            YouTube에서 &quot;{searchQuery}&quot; 검색
          </p>
        </div>
        <Search className="h-4 w-4 text-[var(--fg-muted)] group-hover:text-brand-600" />
      </a>
    );
  }

  return null;
}
