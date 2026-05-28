"use client";

import { useRef, useState } from "react";
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useInventory } from "@/lib/inventory";
import { useTraitOverrides } from "@/lib/trait-overrides";
import { useVideoOverrides } from "@/lib/video-overrides";
import { useCustomTools } from "@/lib/tools";
import { useSettings } from "@/lib/settings";
import { endSession, removePin } from "@/lib/pin";
import { cn } from "@/lib/cn";

const KEYS_TO_RESET = [
  "today-favorites-v1",
  "today-inventory-v1",
  "today-trait-overrides-v1",
  "today-video-overrides-v1",
  "today-custom-tools-v1",
  "today-settings-v1",
  "today-pin-hash-v1",
  "today-pin-session-v1",
];

interface ExportPayload {
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function DataManager() {
  const { favs } = useFavorites();
  const { inv, ownedCount } = useInventory();
  const { countOverrides } = useTraitOverrides();
  const { overrides: videoOverrides, count: videoOverrideCount } =
    useVideoOverrides();
  const { customs } = useCustomTools();
  const { settings } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetStep, setResetStep] = useState<0 | 1>(0);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  function handleExport() {
    const payload: ExportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        favorites: Array.from(favs),
        inventory: inv,
        traitOverrides: JSON.parse(
          localStorage.getItem("today-trait-overrides-v1") ?? "{}",
        ),
        videoOverrides,
        customTools: customs,
        settings,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `today-mwo-hagi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    setImportMsg(null);
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as ExportPayload;
      if (!payload?.data) throw new Error("형식 오류");
      const d = payload.data as Record<string, unknown>;
      if (Array.isArray(d.favorites)) {
        localStorage.setItem(
          "today-favorites-v1",
          JSON.stringify(d.favorites),
        );
      }
      if (d.inventory && typeof d.inventory === "object") {
        localStorage.setItem(
          "today-inventory-v1",
          JSON.stringify(d.inventory),
        );
      }
      if (d.traitOverrides && typeof d.traitOverrides === "object") {
        localStorage.setItem(
          "today-trait-overrides-v1",
          JSON.stringify(d.traitOverrides),
        );
      }
      if (d.videoOverrides && typeof d.videoOverrides === "object") {
        localStorage.setItem(
          "today-video-overrides-v1",
          JSON.stringify(d.videoOverrides),
        );
      }
      if (Array.isArray(d.customTools)) {
        localStorage.setItem(
          "today-custom-tools-v1",
          JSON.stringify(d.customTools),
        );
      }
      if (d.settings && typeof d.settings === "object") {
        localStorage.setItem(
          "today-settings-v1",
          JSON.stringify(d.settings),
        );
      }
      // 이벤트 디스패치 → 모든 hook 재계산
      [
        "favorites-changed",
        "inventory-changed",
        "trait-overrides-changed",
        "video-overrides-changed",
        "custom-tools-changed",
        "settings-changed",
      ].forEach((ev) => window.dispatchEvent(new Event(ev)));
      setImportMsg("✓ 가져오기 완료. 페이지 새로고침 권장.");
    } catch (e) {
      setImportMsg(`✗ 가져오기 실패: ${(e as Error).message}`);
    }
  }

  function handleReset() {
    if (resetStep === 0) {
      setResetStep(1);
      return;
    }
    for (const k of KEYS_TO_RESET) localStorage.removeItem(k);
    removePin();
    endSession();
    [
      "favorites-changed",
      "inventory-changed",
      "trait-overrides-changed",
      "video-overrides-changed",
      "custom-tools-changed",
      "settings-changed",
      "pin-changed",
      "pin-session-changed",
    ].forEach((ev) => window.dispatchEvent(new Event(ev)));
    // PIN 제거 후 PinGate가 다시 잠금 화면 표시. 페이지 리로드.
    window.location.href = "/settings";
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        Data
      </p>
      <h2 className="mt-0.5 text-lg font-bold">데이터 관리</h2>

      {/* 현황 요약 */}
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="즐겨찾기" value={favs.size} />
        <Stat label="보유 도구" value={ownedCount} />
        <Stat label="특성 수정" value={countOverrides} />
        <Stat label="영상 수정" value={videoOverrideCount} />
        <Stat label="사용자 도구" value={customs.length} />
      </dl>

      {/* Export / Import */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--line)]/40"
        >
          <Download className="h-4 w-4" />
          JSON 내보내기
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--line)]/40"
        >
          <Upload className="h-4 w-4" />
          JSON 가져오기
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImportFile(f);
            e.target.value = "";
          }}
        />
      </div>

      {importMsg && (
        <p
          className={cn(
            "mt-3 rounded-lg px-3 py-2 text-xs",
            importMsg.startsWith("✓")
              ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
          )}
        >
          {importMsg}
        </p>
      )}

      {/* Reset */}
      <div className="mt-6 rounded-[var(--radius-card-inner)] border border-rose-500/30 bg-rose-50/40 p-4 dark:bg-rose-500/10">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-300" />
          <div className="flex-1">
            <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
              모든 데이터 초기화
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-rose-700/80 dark:text-rose-200/80">
              즐겨찾기·인벤토리·특성 수정·사용자 도구·PIN 모두 삭제. 되돌릴 수
              없음.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className={cn(
            "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            resetStep === 0
              ? "border border-rose-500/40 bg-[var(--bg)] text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-500/15"
              : "bg-rose-500 text-white hover:bg-rose-600",
          )}
        >
          <Trash2 className="h-4 w-4" />
          {resetStep === 0 ? "초기화 시작" : "정말로 모두 삭제 (마지막 확인)"}
        </button>
        {resetStep === 1 && (
          <button
            type="button"
            onClick={() => setResetStep(0)}
            className="mt-2 w-full text-xs text-[var(--fg-muted)] hover:underline"
          >
            취소
          </button>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-2.5 text-center">
      <p className="font-mono text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-[var(--fg-muted)]">{label}</p>
    </div>
  );
}
