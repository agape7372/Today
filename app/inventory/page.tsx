import { Suspense } from "react";
import { getAllGames } from "@/lib/games";
import { InventoryClient } from "@/components/inventory/InventoryClient";

export const metadata = {
  title: "현황",
  description:
    "치료실 도구 인벤토리 — 보유 상태·가격대·사용 게임 양방향 조회.",
};

export default function InventoryPage() {
  const games = getAllGames();
  return (
    <Suspense fallback={<div className="p-12 text-center">불러오는 중...</div>}>
      <InventoryClient games={games} />
    </Suspense>
  );
}
