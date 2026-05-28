import { Suspense } from "react";
import { getAllGames } from "@/lib/games";
import { GamesClient } from "@/components/catalog/GamesClient";

export const metadata = {
  title: "게임 카탈로그",
  description: "근거기반 참여형 재활 게임 카탈로그. 특성으로 정렬해 오늘의 게임 결정.",
};

export default function GamesPage() {
  const games = getAllGames();
  return (
    <Suspense fallback={<div className="p-12 text-center">불러오는 중...</div>}>
      <GamesClient initialGames={games} />
    </Suspense>
  );
}
