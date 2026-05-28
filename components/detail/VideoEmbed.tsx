"use client";

import { Video, Search, ExternalLink } from "lucide-react";
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

function extractInstagramRef(
  url: string,
): { type: "reel" | "p"; id: string } | null {
  const m = url.match(
    /(?:instagram\.com|instagr\.am)\/(?:[\w.]+\/)?(reel|p)\/([\w-]+)/i,
  );
  if (!m) return null;
  return { type: m[1] as "reel" | "p", id: m[2] };
}

function InstagramEmbed({ url }: { url: string }) {
  const ref = extractInstagramRef(url);
  if (!ref) {
    return <InstagramFallback url={url} />;
  }
  // 공식 embed iframe — embed.js 의존성 없음
  const embedSrc = `https://www.instagram.com/${ref.type}/${ref.id}/embed/captioned/`;

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-white shadow-soft">
      <iframe
        src={embedSrc}
        title="Instagram 영상"
        allow="encrypted-media; clipboard-write; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        scrolling="no"
        className="block w-full"
        style={{ minHeight: 720, border: 0 }}
      />
      {/* iframe이 X-Frame-Options에 막힐 경우 대비 fallback 링크 (no-print 제외) */}
      <div className="border-t border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-2 text-center text-[11px] text-[var(--fg-muted)]">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <ExternalLink className="h-3 w-3" />
          Instagram 원본에서 보기
        </a>
      </div>
    </div>
  );
}

function InstagramFallback({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print group flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--line)] bg-gradient-to-r from-rose-50 to-amber-50 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted dark:from-rose-500/10 dark:to-amber-500/10"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-fuchsia-500 to-amber-500 text-white shadow-soft">
        <Video className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">Instagram에서 영상 보기</p>
        <p className="text-xs text-[var(--fg-muted)]">URL 형식이 reel/post 아님</p>
      </div>
      <ExternalLink className="h-4 w-4 text-[var(--fg-muted)]" />
    </a>
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
