# 오늘 뭐하지 (Today's Activity)

> 참여형 재활 그룹 세션용 **근거기반 게임 카탈로그** 웹앱.
> 치료사가 "오늘 그룹 세션에서 뭐 할까?"를 30초 안에 결정하도록 돕는다.

**배포**: https://today-xi.vercel.app

## 무엇인가

재활의학과·요양·장애인/노인 체육 현장의 치료사가 환자 타입과 인원에 맞는 **학술 근거 있는 놀이/운동 활동**을 빠르게 고르는 도구. 게임 선택은 (1) 환자 타입(뇌졸중·SCI·파킨슨·노인·비사용증후군), (2) 학술 근거, (3) 표준화된 진행 방법·인원·준비물을 모두 만족해야 한다.

영감 출처: Instagram [@sc_sportsacademy_](https://www.instagram.com/sc_sportsacademy_/) (SC운동발달아카데미)의 bio "오늘 체육 수업 뭐하지?" — 실전 검증 게임을 학술 근거로 재포장.

## 핵심 기능 (4탭)

| 탭 | 경로 | 설명 |
|----|------|------|
| **소개** | `/` | Framer Motion 인터랙션 랜딩 |
| **게임 카드** | `/games` | **65개** 게임. 환자·운동·자세·인원 필터 + 특성·글자순 정렬 + 검색. URL 쿼리 동기화 |
| **현황** | `/inventory` | 치료실 도구 30개 자동 매칭. 보유 토글 + 구매 추천 ("1개만 사면 N게임 가능") |
| **설정** | `/settings` | PIN(SHA-256) 보호. 게임 특성 override · 영상 교체 · 테마 · 글자크기 · JSON export/import |

게임 상세(`/games/[slug]`)는 **6각형 레이더 차트**(재미·독창성·참여도·난이도·인지부하·기능수준), 메타 그리드, Instagram/YouTube 영상 임베드, 5섹션 가이드라인(준비·진행·변형·안전·평가), 학술 인용, 준비물 매칭 버튼, 인쇄 버튼을 제공한다.

## 학술 근거

게임마다 1-2개 학술 인용(citation · DOI/URL · relevance). 20+편 도입:

- **운동학습**: Alashram(2019) Task-Oriented Training, Taub(1999) CIMT, Lang(2009) 반복량
- **인지**: Sweller(1988) Cognitive Load
- **음악·리듬**: Thaut(1997) Rhythmic Auditory Stimulation
- **균형·전정·안구**: Berg(1989) BBS, Rine(2013), Ciuffreda(2008)
- **평가도구**: Fugl-Meyer(1975), Mathiowetz(1985) Box & Block
- **정서·회상**: Mora-Ripoll(2010) 웃음치료, Butler(1963) Life Review, Woods(2018) Cochrane 회상치료
- **몰입·신기성**: Csikszentmihalyi(1990) Flow, Berlyne(1971), Witmer-Singer(1998)
- **레크리에이션**: Stumbo & Wardlaw(2011), ATRA, Otago Program

## 데이터 모델

게임 = (메타) + (4차원 분류) + (6특성 점수) + (학술 근거). 콘텐츠는 `content/games/*.mdx` (frontmatter + 본문)가 single source of truth.

**4계층 데이터 흐름**:
- **L1 정적 코드** — 게임 MDX, `lib/tools-master.ts` 도구 30개
- **L2 빌드 자동 계산** — `getToolsForGame()` alias 매칭, `lib/stats.ts` 동적 카운트
- **L3 localStorage** — 인벤토리·특성 override·영상 override·즐겨찾기·PIN·글자크기 (`today-*-v1` 키)
- **L4 수동 동기화** — JSON export/import (기기·치료사 간 공유)

## 기술 스택

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript strict
- **Tailwind CSS v4** (`@theme` directive — `tailwind.config` 불필요)
- **Framer Motion v12** (랜딩 인터랙션만)
- **@next/mdx** + gray-matter + next-mdx-remote/rsc
- **next-themes** (다크모드), lucide-react (아이콘), Pretendard (폰트)
- 정적 SSG **76 routes** — GitHub push → Vercel 자동 배포

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 (76 routes prerender)
```

## 게임 추가

1. `content/games/<slug>.mdx` 작성 (frontmatter + 5섹션 본문, **단어형 종결**)
2. `npm run build` 통과 확인
3. 랜딩·카탈로그·상세·통계 모두 자동 반영 (수동 작업 0 — `getAllGames()` / `getSiteStats()` 단일 경로)

## 콘텐츠 규칙

- **단어형 종결**: "확인한다" → "확인", "준비해야 한다" → "준비" (스캐닝 친화)
- **시각 우선**: 숫자보다 TraitRadar 그래프가 먼저·크게
- **팔레트**: emerald-500(주) · sky-500(보조) · amber-500(따뜻함) · zinc(중성)
