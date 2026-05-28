import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Game } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "games");

// Module-level memoization — same-process reads stay cheap during SSG build.
let cache: Game[] | null = null;

export function getAllGames(): Game[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) {
    cache = [];
    return cache;
  }
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const games: Game[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      ...(data as Omit<Game, "body">),
      body: content.trim(),
    } satisfies Game;
  });

  cache = games;
  return cache;
}

export function getGameBySlug(slug: string): Game | undefined {
  return getAllGames().find((g) => g.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllGames().map((g) => g.slug);
}
