import { MeetingClient } from "@/components/meeting/MeetingClient";

export const metadata = {
  title: "회의",
  description: "관리자 전용 회의 보드 — 기대 효과·문제점·활성화 방안·아이디어·게임 요청을 안건별로 논의.",
  robots: { index: false, follow: false },
};

export default function MeetingPage() {
  return <MeetingClient />;
}
