import type { ReactNode } from "react";

// 게임 본문 마크다운의 작은 부분집합 전용 렌더러.
// 지원: "- 불릿", "1. 번호", "**굵게**", "> 인용", "### 소제목", 문단.
// prose-game 클래스 안에서 MDXRemote 출력과 동일한 요소(ul/ol/li/strong/
// blockquote/p/h3)를 내보내 스타일이 그대로 적용됨.

type Block =
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "h3"; text: string }
  | { type: "p"; text: string };

function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] | null = null;

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote) {
      blocks.push({ type: "quote", lines: quote });
      quote = null;
    }
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (line === "") {
      flushAll();
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      flushQuote();
      if (list?.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(line.replace(/^[-*]\s+/, ""));
    } else if (/^\d+\.\s+/.test(line)) {
      flushPara();
      flushQuote();
      if (list?.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(line.replace(/^\d+\.\s+/, ""));
    } else if (/^>\s?/.test(line)) {
      flushPara();
      flushList();
      quote = quote ?? [];
      quote.push(line.replace(/^>\s?/, ""));
    } else if (/^###\s+/.test(line)) {
      flushAll();
      blocks.push({ type: "h3", text: line.replace(/^###\s+/, "") });
    } else {
      flushList();
      flushQuote();
      para.push(line);
    }
  }
  flushAll();
  return blocks;
}

// "**굵게**" 인라인 처리.
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  for (const m of text.matchAll(/\*\*(.+?)\*\*/g)) {
    const idx = m.index ?? 0;
    if (idx > lastIndex) nodes.push(text.slice(lastIndex, idx));
    nodes.push(<strong key={`${keyBase}-b${i}`}>{m[1]}</strong>);
    lastIndex = idx + m[0].length;
    i += 1;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function MiniMarkdown({ source }: { source: string }) {
  const blocks = parseBlocks(source);
  return (
    <>
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case "ul":
            return (
              <ul key={key}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={key}>
                {b.lines.map((ln, j) => (
                  <span key={j} className="block">
                    {renderInline(ln, `${key}-${j}`)}
                  </span>
                ))}
              </blockquote>
            );
          case "h3":
            return <h3 key={key}>{renderInline(b.text, key)}</h3>;
          default:
            return <p key={key}>{renderInline(b.text, key)}</p>;
        }
      })}
    </>
  );
}
