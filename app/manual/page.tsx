import type { ReactNode } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Users,
  Repeat,
  Lightbulb,
  ShoppingCart,
  UserCheck,
  ListChecks,
  PencilLine,
  Clock,
  CalendarCheck,
  Megaphone,
  ArrowRight,
  Activity,
  HeartPulse,
} from "lucide-react";

export const metadata = {
  title: "메뉴얼",
  description:
    "참여형 재활 운영 방법 안내 — 운영 원칙, 출근 후 할 일, 시간표 작성, 퇴근 전 확인, 평가주 운영을 한눈에.",
};

const TOC = [
  { id: "principles", n: "01", label: "운영 원칙" },
  { id: "arrival", n: "02", label: "출근 후 할 일" },
  { id: "timetable", n: "03", label: "활동 작성" },
  { id: "before-leave", n: "04", label: "퇴근 전 확인" },
  { id: "eval-week", n: "05", label: "평가주 운영" },
] as const;

export default function ManualPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* 헤더 */}
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          STAFF MANUAL
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          참여형 재활 운영 방법
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          모든 선생님이 함께 만드는 활동입니다. 운영 원칙부터 하루 일과,
          시간표 작성, 평가주 운영까지 아래 순서대로 확인해 주세요.
        </p>
      </header>

      {/* 목차 (sticky) */}
      <nav
        aria-label="목차"
        className="no-print sticky top-14 z-20 -mx-4 mb-6 border-b border-[var(--line)] bg-[var(--bg)]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        <ol className="flex flex-wrap gap-1.5">
          {TOC.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400"
              >
                <span className="font-mono text-brand-600/70 dark:text-brand-400/70">
                  {t.n}
                </span>
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-5">
        {/* ── 1. 운영 원칙 ───────────────────────────── */}
        <Section id="principles" n="01" icon={ClipboardList} title="참여형 재활 운영 원칙">
          <Callout tone="brand" icon={CheckCircle2} title="필수 참석">
            <p>
              모든 선생님은 <Em>하루 1회 이상</Em> 참여형 재활에 참석합니다.
            </p>
            <p className="mt-1 text-[var(--fg-muted)]">
              2회 이상 참여해 주시면 더욱 감사합니다 🙏
            </p>
          </Callout>

          <H3 icon={Users}>로테이션 주도 구성</H3>
          <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
            로테이션 방식의 활동을 추가로 운영합니다. 아래 4명이 주도적으로
            진행합니다.
          </p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <TeamCard icon={Activity} role="PT" count={2} tone="brand" />
            <TeamCard icon={HeartPulse} role="OT" count={2} tone="accent" />
          </div>
          <FlowNote>
            총 <Em>4명</Em>이 주도 · 주 <Em>2개</Em> 활동 · <Em>일주일 단위</Em> 운영
          </FlowNote>

          <H3 icon={Repeat}>로테이션 활동 진행</H3>
          <ul className="space-y-2">
            <Li>
              윷놀이, 계란판에 탁구공 던지기 외에도 <Em>다양한 활동</Em>을 진행해
              주세요.
            </Li>
            <Li>기존 도구를 활용한 유사 활동도 가능합니다.</Li>
          </ul>
          <Callout tone="warm" icon={Lightbulb} title="활동 예시">
            <ul className="space-y-1.5">
              <ExLi>탁구공 굴려서 계란판에 넣기</ExLi>
              <ExLi>색깔별 탁구공 분류하기</ExLi>
            </ul>
            <p className="mt-2 text-[var(--fg-muted)]">
              환자분들이 다양한 활동에 참여할 수 있도록 협조 부탁드립니다.
            </p>
          </Callout>
          <Callout tone="accent" icon={ShoppingCart} title="도구가 필요하면">
            <p>
              진행하고 싶은 활동이 있으나 필요한 도구가 없는 경우, 말씀해 주시면
              <Em> 도구 구매를 고려</Em>하겠습니다.
            </p>
          </Callout>

          <H3 icon={UserCheck}>주도 선생님 선정 기준</H3>
          <ul className="space-y-2">
            <Li>
              기본적으로 <Em>PT 2명 · OT 2명</Em>을 순차적으로 선정합니다.
            </Li>
            <Li>참여도가 낮은 선생님은 활동 주도를 추가로 배정할 수 있습니다.</Li>
            <Li>
              액팅 및 기타 오류가 발생한 선생님은 <Em>당일 추가 활동</Em>에
              참여합니다.
            </Li>
          </ul>
        </Section>

        {/* ── 2. 출근 후 해야 할 일 ───────────────────── */}
        <Section id="arrival" n="02" icon={Clock} title="출근 후 해야 할 일">
          <ol className="space-y-3">
            <Step n={1} title="본인 치료 스케줄 확인">
              출근 후 본인의 치료 시간표를 먼저 확인합니다.
            </Step>
            <Step n={2} title="환자 배정 작성 — 왼쪽 시간표">
              <p>왼쪽 시간표에는 아래 내용을 작성합니다.</p>
              <ul className="mt-2 space-y-1.5">
                <Li tone="accent">참여형 재활 참석 환자</Li>
                <Li tone="accent">병실 재활 진행 환자</Li>
              </ul>
              <Aside>
                해당 시간대에 어떤 환자가 참여하는지 확인할 수 있도록 작성합니다.
              </Aside>
            </Step>
          </ol>
        </Section>

        {/* ── 3. 활동 작성 방법 ──────────────────────── */}
        <Section
          id="timetable"
          n="03"
          icon={PencilLine}
          title="참여형 재활 활동 작성 방법"
          subtitle="오른쪽 시간표 — 활동 운영 현황을 작성하는 공간"
        >
          <div className="space-y-4">
            <Case label="① 활동에 참석하는 경우">
              <p>해당 활동 오른쪽 공란에 <Em>본인 이름</Em>을 작성합니다.</p>
              <ExampleBox lines={["젠가 – 김OO", "미니볼링 – 이OO"]} />
            </Case>
            <Case label="② 활동을 주도하는 경우">
              <p>
                <Em>활동명</Em>과 <Em>본인 이름</Em>을 함께 작성합니다.
              </p>
              <ExampleBox lines={["젠가 – 김OO", "퍼즐 – 이OO"]} />
            </Case>
          </div>
          <Aside>
            어떤 선생님이 어떤 활동을 운영하는지 한눈에 확인할 수 있도록
            작성합니다.
          </Aside>
        </Section>

        {/* ── 4. 퇴근 전 확인 ───────────────────────── */}
        <Section id="before-leave" n="04" icon={CheckCircle2} title="퇴근 전 확인 사항">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-card-inner)] border border-brand-500/30 bg-brand-50/60 px-4 py-3 dark:bg-brand-500/10">
              <Clock className="h-5 w-5 text-brand-600 dark:text-brand-400" aria-hidden />
              <span className="font-mono text-2xl font-bold text-brand-700 dark:text-brand-300">
                15:15
              </span>
              <span className="text-sm font-medium">까지 시간표 최신화</span>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            <Li>모든 선생님은 15:15까지 시간표를 최신 상태로 갱신합니다.</Li>
            <Li>
              작성 완료 후 본인 이름에 <Em>○ 표시</Em>를 하여 최종 확인합니다.
            </Li>
          </ul>
        </Section>

        {/* ── 5. 평가주 운영 ────────────────────────── */}
        <Section id="eval-week" n="05" icon={CalendarCheck} title="평가주 운영 방법">
          <div className="space-y-4">
            <Case label="① 고정 활동 주도 선생님">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["장해민T", "이경미T", "서원빈T"].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p>
                평가주에는 다른 선생님에게 활동을 인계하여{" "}
                <Em>소규모로라도 활동이 유지</Em>될 수 있도록 합니다.
              </p>
            </Case>
            <Case label="② 추가 참여 활동 주도 선생님">
              <p>
                평가 시간을 제외한 <Em>다른 시간대로 변경</Em>하여 활동을
                유지합니다.
              </p>
            </Case>
          </div>
          <Aside>
            평가주에도 참여형 재활이 지속적으로 운영될 수 있도록 협조 부탁드립니다.
          </Aside>
        </Section>

        {/* 마무리 안내 */}
        <Callout tone="rose" icon={Megaphone} title="문의 안내">
          <p className="leading-relaxed">
            참여형 재활에 대하여 헷갈리거나 잘 모르시는 부분이 있어 공지드립니다.
            읽어보시고 이해가 안 되거나 궁금한 점은 언제든 편하게 말씀해 주세요.
            감사합니다!
          </p>
        </Callout>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * 재사용 컴포넌트 (서버 컴포넌트 — 상호작용 없음)
 * ───────────────────────────────────────────────────────────── */

type IconType = typeof ClipboardList;

function Section({
  id,
  n,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  n: string;
  icon: IconType;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-elevated)] p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft"
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold text-brand-600/70 dark:text-brand-400/70">
            {n}
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--fg-muted)]">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

const CALLOUT_TONES = {
  brand: "border-brand-500/30 bg-brand-50/60 dark:bg-brand-500/10",
  warm: "border-warm-500/30 bg-warm-300/15 dark:bg-warm-500/10",
  accent: "border-accent-500/30 bg-accent-50/70 dark:bg-accent-500/10",
  rose: "border-rose-500/30 bg-rose-50/60 dark:bg-rose-500/10",
} as const;

const CALLOUT_ICON_TONES = {
  brand: "text-brand-600 dark:text-brand-400",
  warm: "text-warm-600 dark:text-warm-300",
  accent: "text-accent-600 dark:text-accent-400",
  rose: "text-rose-600 dark:text-rose-400",
} as const;

function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: keyof typeof CALLOUT_TONES;
  icon: IconType;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card-inner)] border p-4 ${CALLOUT_TONES[tone]}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className={`h-4 w-4 shrink-0 ${CALLOUT_ICON_TONES[tone]}`} aria-hidden />
        <p className="text-sm font-bold">{title}</p>
      </div>
      <div className="mt-1.5 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function H3({ icon: Icon, children }: { icon: IconType; children: ReactNode }) {
  return (
    <h3 className="mt-5 flex items-center gap-1.5 text-base font-bold first:mt-0">
      <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" aria-hidden />
      {children}
    </h3>
  );
}

function Li({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "accent";
}) {
  const dot = tone === "accent" ? "bg-accent-500" : "bg-brand-500";
  return (
    <li className="relative pl-4 text-sm leading-relaxed">
      <span
        className={`absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full ${dot}`}
        aria-hidden
      />
      {children}
    </li>
  );
}

function ExLi({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-1.5 text-sm leading-relaxed">
      <ArrowRight className="mt-[0.2em] h-3.5 w-3.5 shrink-0 text-warm-600 dark:text-warm-300" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-mono text-sm font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <div className="mt-1 text-sm leading-relaxed text-[var(--fg-muted)]">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}

function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card-inner)] border border-[var(--line)] bg-[var(--bg)] p-4">
      <p className="mb-2 text-sm font-bold text-brand-700 dark:text-brand-300">
        {label}
      </p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ExampleBox({ lines }: { lines: string[] }) {
  return (
    <div className="mt-2.5">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--fg-muted)]">
        예시
      </p>
      <ul className="space-y-1">
        {lines.map((line) => (
          <li
            key={line}
            className="rounded-lg bg-[var(--bg-elevated)] px-3 py-1.5 font-mono text-sm shadow-soft"
          >
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamCard({
  icon: Icon,
  role,
  count,
  tone,
}: {
  icon: IconType;
  role: string;
  count: number;
  tone: "brand" | "accent";
}) {
  const ring =
    tone === "brand"
      ? "border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10"
      : "border-accent-500/30 bg-accent-50/60 dark:bg-accent-500/10";
  const iconTone =
    tone === "brand"
      ? "text-brand-600 dark:text-brand-400"
      : "text-accent-600 dark:text-accent-400";
  return (
    <div className={`rounded-[var(--radius-card-inner)] border p-4 ${ring}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconTone}`} aria-hidden />
        <span className="text-lg font-bold">
          {role} <span className="font-mono">{count}명</span>
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        → 1개의 활동을 주도적으로 진행
      </p>
    </div>
  );
}

function FlowNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2.5 flex items-center gap-2 rounded-[var(--radius-card-inner)] border border-dashed border-[var(--line)] px-4 py-2.5 text-sm">
      <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

function Aside({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 border-l-[3px] border-accent-500 bg-accent-50/40 py-2 pl-3 text-sm text-[var(--fg-muted)] dark:bg-accent-500/5">
      → {children}
    </p>
  );
}

function Em({ children }: { children: ReactNode }) {
  return (
    <strong className="font-bold text-brand-700 dark:text-brand-300">
      {children}
    </strong>
  );
}
