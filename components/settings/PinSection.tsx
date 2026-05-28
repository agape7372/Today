"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound, Unlock } from "lucide-react";
import {
  changePin,
  endSession,
  removePin,
  usePinState,
} from "@/lib/pin";
import { cn } from "@/lib/cn";

export function PinSection() {
  const state = usePinState();
  const [mode, setMode] = useState<"idle" | "change">("idle");
  const [old, setOld] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{4}$/.test(old) || !/^\d{4}$/.test(next)) {
      setError("4자리 숫자만 입력");
      return;
    }
    if (next !== confirm) {
      setError("새 PIN이 일치하지 않음");
      return;
    }
    const ok = await changePin(old, next);
    if (!ok) {
      setError("기존 PIN이 일치하지 않음");
      return;
    }
    setSuccess(true);
    setOld("");
    setNext("");
    setConfirm("");
    setMode("idle");
    setTimeout(() => setSuccess(false), 2500);
  }

  function handleEndSession() {
    endSession();
  }

  function handleRemove() {
    if (!confirm) return;
    if (
      !window.confirm("PIN을 제거하면 누구나 설정에 접근. 정말로 제거할까요?")
    )
      return;
    removePin();
  }

  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          PIN
        </p>
      </div>
      <h2 className="mt-0.5 text-lg font-bold">관리자 PIN</h2>
      <p className="mt-1 text-xs text-[var(--fg-muted)]">
        {state.sessionExpiresAt
          ? `세션 만료 시각: ${new Date(state.sessionExpiresAt).toLocaleString("ko-KR")}`
          : "세션 정보 없음"}
      </p>

      {success && (
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
          ✓ PIN 변경 완료
        </p>
      )}

      {mode === "idle" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("change")}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--line)]/40"
          >
            <KeyRound className="h-3.5 w-3.5" />
            PIN 변경
          </button>
          <button
            type="button"
            onClick={handleEndSession}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--line)]/40"
          >
            <Unlock className="h-3.5 w-3.5" />
            세션 종료 (지금 잠금)
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/15"
          >
            PIN 제거
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <PinInput
            label="기존 PIN"
            value={old}
            onChange={(v) => {
              setOld(v);
              setError(null);
            }}
          />
          <PinInput
            label="새 PIN"
            value={next}
            onChange={(v) => {
              setNext(v);
              setError(null);
            }}
          />
          <PinInput
            label="새 PIN 확인"
            value={confirm}
            onChange={(v) => {
              setConfirm(v);
              setError(null);
            }}
          />
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              변경
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("idle");
                setError(null);
                setOld("");
                setNext("");
                setConfirm("");
              }}
              className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-medium"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function PinInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </label>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="••••"
        className={cn(
          "w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-center font-mono text-lg tracking-[0.4em] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30",
        )}
      />
    </div>
  );
}
