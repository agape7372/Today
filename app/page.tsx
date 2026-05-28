import { getAllGames } from "@/lib/games";
import { getSiteStats } from "@/lib/stats";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { EvidenceStrip } from "@/components/landing/EvidenceStrip";
import { PreviewGrid } from "@/components/landing/PreviewGrid";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  // 모든 통계는 lib/stats.ts가 단일 진실의 원천. 게임 추가/제거 시 자동 갱신.
  const stats = getSiteStats();
  const games = getAllGames();
  return (
    <>
      <Hero stats={stats} />
      <Features stats={stats} />
      <HowItWorks />
      <EvidenceStrip stats={stats} />
      <PreviewGrid games={games.slice(0, 6)} />
      <FinalCTA stats={stats} />
    </>
  );
}
