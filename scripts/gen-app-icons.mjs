// Generates the static PWA icon PNGs for "오늘 뭐하지" (candidate #1 design:
// white "오늘" on a 135deg emerald→sky gradient). Run: node scripts/gen-app-icons.mjs
// Reuses the committed subset Korean font so Hangul renders (not tofu) in Satori.
import { createElement as h } from "react";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const { ImageResponse } = await import("next/dist/server/og/image-response.js");

const font = await readFile(
  join(process.cwd(), "public/fonts/Pretendard-Bold.subset.ttf"),
);

const GRAD = "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)";

// maskable: full-bleed gradient, no corner radius, smaller text inside the
// ~80% safe zone so Android's circular/squircle mask never clips the wordmark.
function iconEl(size, { maskable = false } = {}) {
  const radius = maskable ? 0 : Math.round(size * 0.225);
  const fontSize = Math.round(size * (maskable ? 0.34 : 0.46));
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: GRAD,
        color: "#ffffff",
        fontFamily: "Pretendard",
        fontWeight: 700,
        letterSpacing: "-0.05em",
        borderRadius: radius,
        fontSize,
      },
    },
    "오늘",
  );
}

async function render(size, opts) {
  const res = new ImageResponse(iconEl(size, opts), {
    width: size,
    height: size,
    fonts: [{ name: "Pretendard", data: font, weight: 700, style: "normal" }],
  });
  return Buffer.from(await res.arrayBuffer());
}

const targets = [
  ["public/icon-192.png", 192, {}],
  ["public/icon-512.png", 512, {}],
  ["public/icon-maskable-512.png", 512, { maskable: true }],
  // throwaway previews for visual QA (not committed)
  ["/tmp/preview-32.png", 32, {}],
  ["/tmp/preview-180.png", 180, {}],
];

for (const [path, size, opts] of targets) {
  const buf = await render(size, opts);
  await writeFile(path, buf);
  console.log(`${path}  ${size}x${size}  ${buf.length} bytes`);
}
