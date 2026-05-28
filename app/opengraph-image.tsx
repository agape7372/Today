import { ImageResponse } from "next/og";

export const alt = "오늘 뭐하지 — 참여형 재활 게임 카탈로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 60%, #fef3c7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#047857",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          근거기반 참여형 재활 카탈로그
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            color: "#0f172a",
            lineHeight: 1.05,
          }}
        >
          오늘, 뭐할까?
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 36,
            color: "#475569",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          치료사가 30초 안에 결정하는
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#475569",
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          그룹 재활 게임 10선.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            alignItems: "center",
            gap: 32,
            fontSize: 24,
            color: "#0f172a",
            fontWeight: 600,
          }}
        >
          <span>15+ 논문 인용</span>
          <span style={{ color: "#94a3b8" }}>·</span>
          <span>6개 환자 타입</span>
          <span style={{ color: "#94a3b8" }}>·</span>
          <span>6개 평가 지표</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
