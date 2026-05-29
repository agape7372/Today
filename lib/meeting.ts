"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  Target,
  AlertTriangle,
  Rocket,
  Lightbulb,
  Gamepad2,
} from "lucide-react";

type SectionIcon = ComponentType<{ className?: string }>;

// ─────────────────────────────────────────────────────────────
// 회의 보드 데이터 레이어
// 저장 모델: 단일 localStorage 키(today-meeting-v1). favorites/inventory와
// 동일한 read/write + 커스텀 이벤트 + storage 이벤트 동기화 패턴을 따른다.
// 백엔드가 없으므로 한 브라우저(예: 공용 회의용 기기) 안에서 동작하며,
// Markdown / JSON 내보내기로 회의록을 공유·백업한다.
// ─────────────────────────────────────────────────────────────

const KEY = "today-meeting-v1";
const AUTHOR_KEY = "today-meeting-author-v1";
const EVENT = "meeting-changed";
const AUTHOR_EVENT = "meeting-author-changed";

export type SectionId =
  | "expected"
  | "problems"
  | "activation"
  | "ideas"
  | "game-requests";

export type ItemStatus = "open" | "active" | "done";

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO
}

export interface AgendaItem {
  id: string;
  section: SectionId;
  title: string;
  body?: string;
  link?: string; // 주로 game-requests 용 참고 링크
  author: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  pinned?: boolean;
  status: ItemStatus;
  votes: string[]; // 공감한 사람 이름 목록
  comments: Comment[];
}

interface MeetingStore {
  version: 1;
  items: AgendaItem[];
  updatedAt: string;
}

export interface SectionMeta {
  id: SectionId;
  index: number;
  label: string;
  icon: SectionIcon;
  hint: string;
  tone: "brand" | "rose" | "accent" | "warm" | "violet";
  placeholder: string;
  /** 이 섹션은 참고 링크 입력란을 노출 */
  withLink?: boolean;
}

export const SECTIONS: readonly SectionMeta[] = [
  {
    id: "expected",
    index: 1,
    label: "기대 효과",
    icon: Target,
    hint: "이 도구로 무엇이 나아지는가",
    tone: "brand",
    placeholder: "기대하는 효과를 한 줄로",
  },
  {
    id: "problems",
    index: 2,
    label: "문제점·어려움 요소",
    icon: AlertTriangle,
    hint: "막히는 지점, 리스크, 우려",
    tone: "rose",
    placeholder: "문제점이나 어려움을 한 줄로",
  },
  {
    id: "activation",
    index: 3,
    label: "활성화 방안",
    icon: Rocket,
    hint: "더 많이·더 잘 쓰이게 하려면",
    tone: "accent",
    placeholder: "활성화 아이디어를 한 줄로",
  },
  {
    id: "ideas",
    index: 4,
    label: "프리 아이디어 존",
    icon: Lightbulb,
    hint: "형식 없는 자유 발상",
    tone: "warm",
    placeholder: "떠오르는 아이디어를 자유롭게",
  },
  {
    id: "game-requests",
    index: 5,
    label: "이 게임 추가해주세요",
    icon: Gamepad2,
    hint: "참고 링크를 남기면 개발자가 새 게임으로 제작",
    tone: "violet",
    placeholder: "추가하고 싶은 게임 이름",
    withLink: true,
  },
];

export function sectionMeta(id: SectionId): SectionMeta {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0];
}

export const STATUSES: readonly ItemStatus[] = ["open", "active", "done"];

const STATUS_LABELS: Record<ItemStatus, string> = {
  open: "열림",
  active: "논의중",
  done: "완료",
};

const REQUEST_STATUS_LABELS: Record<ItemStatus, string> = {
  open: "요청",
  active: "개발중",
  done: "배포완료",
};

export function statusLabel(section: SectionId, status: ItemStatus): string {
  return section === "game-requests"
    ? REQUEST_STATUS_LABELS[status]
    : STATUS_LABELS[status];
}

export function statusTone(status: ItemStatus): "neutral" | "accent" | "brand" {
  return status === "done" ? "brand" : status === "active" ? "accent" : "neutral";
}

// ── 저수준 read/write ────────────────────────────────────────

function emptyStore(): MeetingStore {
  return { version: 1, items: [], updatedAt: new Date().toISOString() };
}

function read(): MeetingStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object" || !Array.isArray(obj.items)) {
      return emptyStore();
    }
    // 방어적 정규화 — 누락 필드 보정
    const items: AgendaItem[] = obj.items.map(normalizeItem).filter(Boolean) as AgendaItem[];
    return { version: 1, items, updatedAt: obj.updatedAt ?? new Date().toISOString() };
  } catch {
    return emptyStore();
  }
}

function normalizeItem(raw: unknown): AgendaItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.title !== "string") return null;
  const validSection = SECTIONS.some((s) => s.id === r.section);
  return {
    id: r.id,
    section: (validSection ? r.section : "ideas") as SectionId,
    title: r.title,
    body: typeof r.body === "string" ? r.body : undefined,
    link: typeof r.link === "string" ? r.link : undefined,
    author: typeof r.author === "string" ? r.author : "익명",
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : new Date().toISOString(),
    pinned: Boolean(r.pinned),
    status: (STATUSES as readonly string[]).includes(r.status as string)
      ? (r.status as ItemStatus)
      : "open",
    votes: Array.isArray(r.votes) ? (r.votes.filter((v) => typeof v === "string") as string[]) : [],
    comments: Array.isArray(r.comments)
      ? (r.comments
          .map(normalizeComment)
          .filter(Boolean) as Comment[])
      : [],
  };
}

function normalizeComment(raw: unknown): Comment | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.text !== "string") return null;
  return {
    id: typeof r.id === "string" ? r.id : uid(),
    author: typeof r.author === "string" ? r.author : "익명",
    text: r.text,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
  };
}

function write(items: AgendaItem[]) {
  if (typeof window === "undefined") return;
  try {
    const store: MeetingStore = {
      version: 1,
      items,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* quota */
  }
}

export function uid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fallthrough */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── 메인 훅 ──────────────────────────────────────────────────

export interface NewItemInput {
  section: SectionId;
  title: string;
  body?: string;
  link?: string;
  author: string;
}

export function useMeeting() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read().items);
    setHydrated(true);
    const onChange = () => setItems(read().items);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) onChange();
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const addItem = useCallback((input: NewItemInput) => {
    const now = new Date().toISOString();
    const item: AgendaItem = {
      id: uid(),
      section: input.section,
      title: input.title.trim(),
      body: input.body?.trim() || undefined,
      link: input.link?.trim() || undefined,
      author: input.author.trim() || "익명",
      createdAt: now,
      updatedAt: now,
      pinned: false,
      status: "open",
      votes: [],
      comments: [],
    };
    const next = [item, ...read().items];
    write(next);
    setItems(next);
    return item.id;
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<AgendaItem, "id" | "createdAt" | "section">>) => {
      const next = read().items.map((it) =>
        it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it,
      );
      write(next);
      setItems(next);
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    const next = read().items.filter((it) => it.id !== id);
    write(next);
    setItems(next);
  }, []);

  const togglePin = useCallback((id: string) => {
    const next = read().items.map((it) =>
      it.id === id ? { ...it, pinned: !it.pinned, updatedAt: new Date().toISOString() } : it,
    );
    write(next);
    setItems(next);
  }, []);

  const setStatus = useCallback((id: string, status: ItemStatus) => {
    const next = read().items.map((it) =>
      it.id === id ? { ...it, status, updatedAt: new Date().toISOString() } : it,
    );
    write(next);
    setItems(next);
  }, []);

  const toggleVote = useCallback((id: string, voter: string) => {
    const name = voter.trim() || "익명";
    const next = read().items.map((it) => {
      if (it.id !== id) return it;
      const has = it.votes.includes(name);
      return {
        ...it,
        votes: has ? it.votes.filter((v) => v !== name) : [...it.votes, name],
      };
    });
    write(next);
    setItems(next);
  }, []);

  const addComment = useCallback((id: string, author: string, text: string) => {
    const body = text.trim();
    if (!body) return;
    const comment: Comment = {
      id: uid(),
      author: author.trim() || "익명",
      text: body,
      createdAt: new Date().toISOString(),
    };
    const next = read().items.map((it) =>
      it.id === id
        ? { ...it, comments: [...it.comments, comment], updatedAt: new Date().toISOString() }
        : it,
    );
    write(next);
    setItems(next);
  }, []);

  const removeComment = useCallback((itemId: string, commentId: string) => {
    const next = read().items.map((it) =>
      it.id === itemId
        ? { ...it, comments: it.comments.filter((c) => c.id !== commentId) }
        : it,
    );
    write(next);
    setItems(next);
  }, []);

  const replaceAll = useCallback((nextItems: AgendaItem[]) => {
    write(nextItems);
    setItems(nextItems);
  }, []);

  const clearAll = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  return {
    items,
    hydrated,
    addItem,
    updateItem,
    removeItem,
    togglePin,
    setStatus,
    toggleVote,
    addComment,
    removeComment,
    replaceAll,
    clearAll,
  };
}

// ── 작성자 이름 훅 ───────────────────────────────────────────

export function useMeetingAuthor(): [string, (name: string) => void] {
  const [name, setNameState] = useState("");

  useEffect(() => {
    try {
      setNameState(window.localStorage.getItem(AUTHOR_KEY) ?? "");
    } catch {
      /* ignore */
    }
    const onChange = () => {
      try {
        setNameState(window.localStorage.getItem(AUTHOR_KEY) ?? "");
      } catch {
        /* ignore */
      }
    };
    window.addEventListener(AUTHOR_EVENT, onChange);
    return () => window.removeEventListener(AUTHOR_EVENT, onChange);
  }, []);

  const setName = useCallback((n: string) => {
    try {
      window.localStorage.setItem(AUTHOR_KEY, n);
      window.dispatchEvent(new Event(AUTHOR_EVENT));
    } catch {
      /* ignore */
    }
    setNameState(n);
  }, []);

  return [name, setName];
}

// ── 파생/유틸 ────────────────────────────────────────────────

/** pinned 우선, 그다음 최신순 */
export function sortItems(items: AgendaItem[]): AgendaItem[] {
  return [...items].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  if (sec < 30) return "방금";
  if (sec < 60) return `${sec}초 전`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}일 전`;
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

// ── 내보내기 (Markdown / JSON) ───────────────────────────────

export interface MeetingExport {
  type: "today-meeting";
  version: 1;
  exportedAt: string;
  items: AgendaItem[];
}

export function toExportPayload(items: AgendaItem[]): MeetingExport {
  return {
    type: "today-meeting",
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
  };
}

export function parseImport(text: string): AgendaItem[] | null {
  try {
    const obj = JSON.parse(text);
    const arr = Array.isArray(obj) ? obj : obj?.items;
    if (!Array.isArray(arr)) return null;
    const items = arr.map(normalizeItem).filter(Boolean) as AgendaItem[];
    return items;
  } catch {
    return null;
  }
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** 옵시디언 등에 바로 붙는 회의록 Markdown */
export function toMarkdown(items: AgendaItem[]): string {
  const lines: string[] = [];
  lines.push("# 오늘 뭐하지 — 회의록");
  lines.push("");
  lines.push(`> 내보낸 시각: ${fmtDate(new Date().toISOString())} · 안건 ${items.length}건`);
  lines.push("");

  for (const sec of SECTIONS) {
    const secItems = sortItems(items.filter((it) => it.section === sec.id));
    lines.push(`## ${sec.index}. ${sec.label}`);
    if (secItems.length === 0) {
      lines.push("");
      lines.push("_아직 안건 없음_");
      lines.push("");
      continue;
    }
    lines.push("");
    for (const it of secItems) {
      const pin = it.pinned ? "[고정] " : "";
      const votes = it.votes.length > 0 ? ` (공감 ${it.votes.length})` : "";
      lines.push(`### ${pin}[${statusLabel(sec.id, it.status)}] ${it.title}${votes}`);
      if (it.body) {
        lines.push("");
        lines.push(it.body);
      }
      if (it.link) {
        lines.push("");
        lines.push(`링크: ${it.link}`);
      }
      lines.push("");
      lines.push(`<sub>작성: ${it.author} · ${fmtDate(it.createdAt)}</sub>`);
      if (it.comments.length > 0) {
        lines.push("");
        for (const c of it.comments) {
          lines.push(`- **${c.author}**: ${c.text} <sub>(${fmtDate(c.createdAt)})</sub>`);
        }
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}
