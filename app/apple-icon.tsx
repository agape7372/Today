import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon: full-bleed gradient, no transparency / corner radius —
// iOS applies its own rounded mask. Korean font embedded so "오늘" isn't tofu.
export default async function AppleIcon() {
  const font = await readFile(
    join(process.cwd(), "public/fonts/Pretendard-Bold.subset.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 84,
          background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "Pretendard",
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        오늘
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: font, weight: 700, style: "normal" },
      ],
    },
  );
}
