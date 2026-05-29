// MDX 본문을 "## 헤더" 기준으로 섹션 분리.
// 헤더(준비/진행 단계/변형/안전 주의/평가 포인트)는 고정 틀,
// 그 아래 내용만 편집 대상.

export interface Section {
  /** "## " 뒤 텍스트 (예: "준비") */
  heading: string;
  /** 헤더 아래 마크다운 내용 (trim) */
  content: string;
}

export interface ParsedBody {
  /** 첫 "## " 이전 텍스트 (보통 비어 있음) */
  preamble: string;
  sections: Section[];
}

const H2 = /^##\s+(.*)$/;

export function parseBodySections(body: string): ParsedBody {
  const lines = body.split("\n");
  const preambleLines: string[] = [];
  const sections: Section[] = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const line of lines) {
    const m = line.match(H2);
    if (m) {
      if (current) {
        sections.push({
          heading: current.heading,
          content: current.lines.join("\n").trim(),
        });
      }
      current = { heading: m[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      preambleLines.push(line);
    }
  }
  if (current) {
    sections.push({
      heading: current.heading,
      content: current.lines.join("\n").trim(),
    });
  }

  return { preamble: preambleLines.join("\n").trim(), sections };
}
