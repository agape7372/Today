"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { hasPin, setPin, verifyPin, usePinState } from "@/lib/pin";
import { cn } from "@/lib/cn";

interface Props {
  children: React.ReactNode;
}

export function PinGate({ children }: Props) {
  const state = usePinState();
  const [pin, setPinInput] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 모달 열린 직후 첫 input 포커스
    if (!state.unlocked) {
      const t = setTimeout(() => firstInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [state.unlocked]);

  if (state.unlocked) {
    return <>{children}</>;
  }

  const settingUp = !state.hasPin;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (busy) return;
    if (!/^\d{4}$/.test(pin)) {
      setError("4자리 숫자만 입력");
      return;
    }
    setBusy(true);
    try {
      if (settingUp) {
        if (pin !== confirm) {
          setError("두 번 입력한 PIN이 일치하지 않음");
          setBusy(false);
          return;
        }
        await setPin(pin);
      } else {
        const ok = await verifyPin(pin);
        if (!ok) {
          setError("PIN이 일치하지 않음");
          setBusy(false);
          setPinInput("");
          firstInputRef.current?.focus();
          return;
        }
      }
      // usePinState가 자동 갱신 → children 렌더
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <div className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-lifted sm:p-8">
        <div className="flex items-center gap-2">
          {settingUp ? (
            <ShieldCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          ) : (
            <Lock className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          )}
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {settingUp ? "Setup" : "Locked"}
          </p>
        </div>

        <h1 className="mt-2 text-2xl font-bold">
          {settingUp ? "관리자 PIN 설정" : "PIN 입력"}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)]">
          {settingUp
            ? "설정 페이지는 관리자만 접근. 4자리 PIN을 설정하세요. (이 브라우저에만 저장, 해시 후 보관)"
            : "관리자 PIN 4자리를 입력하면 설정에 접근. 24시간 유효."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
              {settingUp ? "새 PIN (4자리)" : "PIN"}
            </label>
            <input
              ref={firstInputRef}
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPinInput(e.target.value.replace(/\D/g, ""));
                setError(null);
              }}
              placeholder="••••"
              className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-center font-mono text-2xl tracking-[0.4em] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          {settingUp && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
                확인
              </label>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value.replace(/\D/g, ""));
                  setError(null);
                }}
                placeholder="••••"
                className="w-full rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-center font-mono text-2xl tracking-[0.4em] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={cn(
              "w-full rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors",
              "bg-brand-500 hover:bg-brand-600 disabled:opacity-60",
            )}
          >
            {busy ? "처리 중…" : settingUp ? "PIN 설정 + 진입" : "잠금 해제"}
          </button>
        </form>

        {settingUp && (
          <p className="mt-4 text-[11px] leading-relaxed text-[var(--fg-muted)]">
            ⚠ PIN을 잊으면 데이터 관리 섹션에서 모든 localStorage를 초기화해야 함.
            평문은 어디에도 저장하지 않고 SHA-256 해시만 보관.
          </p>
        )}
      </div>
    </div>
  );
}
