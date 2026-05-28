// Throwaway analysis: which game materials match NO tool, and per-game coverage.
// Reads real aliases from lib/tools-master.ts so it stays in sync.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const toolsSrc = fs.readFileSync(path.join(root, "lib", "tools-master.ts"), "utf-8");

// Extract each tool object's id + aliases array.
const tools = [];
const blockRe = /id:\s*"([^"]+)"[\s\S]*?aliases:\s*\[([^\]]*)\]/g;
for (const m of toolsSrc.matchAll(blockRe)) {
  const id = m[1];
  const aliases = [...m[2].matchAll(/"([^"]+)"/g)].map((a) => a[1].toLowerCase());
  tools.push({ id, aliases });
}

// Ambient = space/personnel/optional/none — NOT purchasable equipment.
const AMBIENT_HINTS = [
  "좌석", "바닥", "공간", "원형 배치", "평평",
  "보조자", "보조 인력", "보조 지팡이",
  "도구 없이", "도구 x", "손만",
  "(선택)", "필요 시",
  "점수 영역", "골 표시",
];
const isAmbient = (text) => AMBIENT_HINTS.some((h) => text.includes(h.toLowerCase()));

const dir = path.join(root, "content", "games");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();

const equipFreq = new Map();
let gamesWithEquipGap = 0;
const perGame = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const { data } = matter(raw);
  const materials = data.materials || [];
  const matchedToolIds = new Set();
  const unmatchedEquip = [];
  let ambientCount = 0;
  for (const mat of materials) {
    const text = String(mat).toLowerCase();
    const hits = tools.filter((t) => t.aliases.some((a) => text.includes(a)));
    if (hits.length === 0) {
      if (isAmbient(text)) {
        ambientCount++;
      } else {
        unmatchedEquip.push(mat);
        equipFreq.set(String(mat), (equipFreq.get(String(mat)) || 0) + 1);
      }
    } else {
      hits.forEach((h) => matchedToolIds.add(h.id));
    }
  }
  if (unmatchedEquip.length > 0) gamesWithEquipGap++;
  perGame.push({
    slug: data.slug || file,
    mats: materials.length,
    matchedTools: matchedToolIds.size,
    ambient: ambientCount,
    unmatched: unmatchedEquip.length,
  });
}
const gamesWithUnmatched = gamesWithEquipGap;
const unmatchedFreq = equipFreq;

console.log(`\n=== ${tools.length} tools, ${files.length} games ===`);
console.log(`games with unmatched materials: ${gamesWithUnmatched}/${files.length}`);

console.log(`\n=== UNMATCHED materials (by frequency) ===`);
const sorted = [...unmatchedFreq.entries()].sort((a, b) => b[1] - a[1]);
for (const [mat, n] of sorted) console.log(`${String(n).padStart(2)}x  ${mat}`);

console.log(`\n=== per-game (only those with unmatched) ===`);
for (const g of perGame.filter((g) => g.unmatched > 0)) {
  console.log(`${g.slug}: mats ${g.mats} / matchedTools ${g.matchedTools} / unmatched ${g.unmatched}`);
}
