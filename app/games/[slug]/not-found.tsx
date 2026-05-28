import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="text-5xl">🎲</p>
      <h1 className="mt-4 text-2xl font-bold">게임을 찾을 수 없음</h1>
      <p className="mt-2 text-[var(--fg-muted)]">
        주소를 다시 확인하거나 카탈로그에서 둘러보기
      </p>
      <Link
        href="/games"
        className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600"
      >
        카탈로그로 →
      </Link>
    </section>
  );
}
