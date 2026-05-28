import { getAllGames } from "@/lib/games";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata = {
  title: "설정",
  description: "관리자 PIN 보호. 게임 특성 조절·테마·글자 크기·데이터 관리.",
};

export default function SettingsPage() {
  const games = getAllGames();
  return <SettingsClient games={games} />;
}
