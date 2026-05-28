// Find games with thin/generic-only citations to prioritize reinforcement.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "content", "games");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).sort();

// "generic" = recreation/flow/theory refs that fit almost any game.
const GENERIC = ["Stumbo", "ATRA", "Csikszentmihalyi", "Berlyne", "Witmer"];

const freq = new Map();
const thin = [];

for (const file of files) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
  const refs = data.references || [];
  const citations = refs.map((r) => r.citation || "");
  for (const c of citations) {
    const short = c.split("(")[0].trim().slice(0, 40);
    freq.set(short, (freq.get(short) || 0) + 1);
  }
  const specific = citations.filter(
    (c) => !GENERIC.some((g) => c.includes(g)),
  );
  const hasDoiOrUrl = refs.some((r) => r.doi || r.url);
  if (refs.length < 2 || specific.length === 0 || !hasDoiOrUrl) {
    thin.push({
      slug: data.slug,
      refs: refs.length,
      specific: specific.length,
      hasLink: hasDoiOrUrl,
    });
  }
}

console.log("=== citation frequency (top) ===");
for (const [c, n] of [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25)) {
  console.log(`${String(n).padStart(2)}x  ${c}`);
}

console.log(`\n=== THIN games (refs<2 OR no specific OR no DOI/URL): ${thin.length} ===`);
for (const t of thin) {
  console.log(
    `${t.slug}: refs ${t.refs} / specific ${t.specific} / link ${t.hasLink}`,
  );
}
