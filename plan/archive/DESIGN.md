# 인코딩플러스 Design System

> **요약 (3줄):**
> 1. **무엇을 쓰는 파일?** 인코딩플러스 전용 디자인 시스템 — 색상 팔레트, 타이포그래피, 간격, 레이아웃, 컴포넌트별 스타일 스펙이 모두 정의되어 있다.
> 2. **현재 상태?** 설계 원칙 문서 (구현 현황 아님) — Do/Don't 룰과 구체적인 px·hex 값이 포함되어 있고, 실제 코드에 적용된 기준값이다.
> 3. **언제 참고?** 색상값 확인, 새 컴포넌트 만들 때, "이 값이 맞나?" 확인할 때. 가장 권위 있는 디자인 룰북.

> 2027학년도 디미고 입시 전문 학원 웹사이트
> IT 입시 전문 브랜드 — 기술적 신뢰감 + 학부모·학생 친화적 접근성

---

## Core Identity

인코딩플러스의 디자인은 **IBM Carbon의 절제된 파란 신뢰감**과 **Apple의 섹션 리듬**을 결합한다.
단 하나의 포인트 컬러(스카이블루), 흰/회색 캔버스 교차, 플랫 카드, Pretendard 타이포그래피로 구성된다.

> "기술력은 색으로 과시하지 않는다. 정보의 밀도와 여백의 균형으로 드러낸다."

브랜드가 전달해야 할 것:
- **신뢰** — 9년 누적 합격 실적, 명확한 수강료
- **전문성** — IT 입시 특화, 커리큘럼 체계
- **접근성** — 학부모와 중학생 모두 읽기 쉬운 구조

---

## Color Palette

### Brand Colors

| 이름 | Hex | 용도 |
|------|-----|------|
| Primary | `#0ea5e9` | 주요 CTA 버튼, 링크, active 상태, 포인트 강조 |
| Primary Dark | `#0284c7` | 버튼 hover, 강조 텍스트 |
| Primary Light | `#eaf6fe` | 배지 배경, 아이콘 배경, 선택 상태 배경 |
| Primary Border | `#bae6fd` | 선택된 입력 테두리, 체크박스 테두리 |

### Course Colors

| 이름 | Hex | 용도 |
|------|-----|------|
| Course Blue | `#0ea5e9` / `#0284c7` | 입시 단기특강 (COURSE 01) |
| Course Blue BG | `#eaf6fe` | 단기특강 카드 배경, 태그 |
| Course Purple | `#7c3aed` / `#6d28d9` | 일반전형 특강 (COURSE 02) |
| Course Purple BG | `#f5f3ff` | 일반전형 카드 배경, 태그 |

### Surface Hierarchy

| 이름 | Hex | 용도 |
|------|-----|------|
| Canvas | `#ffffff` | 기본 페이지·카드 배경 |
| Canvas Alt | `#eef0f3` | 외부 배경, 교차 섹션 |
| Section Gray | `#f4f4f6` | 홈 교차 섹션 배경 |
| Surface Subtle | `#fafafb` | 인용, 테이블 alt행, 닫힌 항목 |
| Border Default | `#ececef` | 카드 테두리, 구분선 |
| Border Light | `#f0f0f3` | nav 하단선, 탭 구분선 |

### Text Hierarchy

| 이름 | Hex | 용도 |
|------|-----|------|
| Ink | `#18181b` | 헤드라인, 주요 본문 |
| Ink Secondary | `#3f3f46` | 본문 단락 |
| Ink Muted | `#52525b` | 부제, 설명 텍스트 |
| Ink Subtle | `#71717a` | 메타, 캡션 |
| Ink Tertiary | `#9b9ba5` | 플레이스홀더, 비활성 |
| Ink Faint | `#a1a1aa` | 날짜, 읽기 시간 |

### Semantic Colors

| 이름 | Hex | 용도 |
|------|-----|------|
| Error / New Badge | `#ef4444` | 신규 신청 배지, 에러 |
| Success | `#22c55e` | 활성 토글, 확인 완료 |
| Warning | `#f59e0b` | 경고 안내 |

### Dark Surfaces

| 이름 | Hex | 용도 |
|------|-----|------|
| Dark Canvas | `#18181b` | 비교 테이블 헤더, 푸터 |
| Dark Text | `#ffffff` | 다크 배경 위 텍스트 |

---

## Typography

### Font Family

```
Primary: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif
```

npm 패키지: `@fontsource/pretendard` (400, 500, 600, 700, 800 로드)

### Type Scale

| 이름 | Size | Weight | Letter-spacing | 용도 |
|------|------|--------|---------------|------|
| Display XL | 44px | 800 | -0.03em | 데스크탑 히어로 헤드라인 |
| Display LG | 28px | 800 | -0.03em | 모바일 히어로, 섹션 타이틀 |
| Display MD | 24px | 800 | -0.03em | 페이지 헤더 |
| Headline | 22px | 800 | -0.02em | 섹션 소제목 |
| Title LG | 20px | 800 | -0.02em | 카드 제목 (강좌명) |
| Title MD | 18px | 800 | -0.02em | 카드 내 제목 |
| Title SM | 16px | 700 | 0 | 질문, 소항목 |
| Body LG | 16px | 400 | 0 | 본문 단락 |
| Body MD | 15px | 400/500 | 0 | UI 본문, 버튼 |
| Body SM | 14px | 400/500 | 0 | 카드 설명, 입력 |
| Caption | 13px | 400/600 | 0 | 메타정보, 날짜 |
| Label | 12px | 600/700 | 0 | 배지, 태그, 상단 레이블 |
| Micro | 11px | 600 | 0 | 탭 레이블, 최소 UI |

### Key Rules

- 헤드라인은 항상 font-weight 800, letter-spacing -0.02 ~ -0.03em
- 상단 레이블 텍스트 (예: "2027학년도 디미고 입시"): 13px, 700, Primary 색상
- 숫자 강조 (합격생 수, 수강료): 27~32px, 800, Primary 색상
- 버튼 텍스트: 15~16px, 700

---

## Spacing Scale

Base unit: **4px**

| Token | Value | 용도 |
|-------|-------|------|
| xs | 4px | 아이콘·배지 내부 |
| sm | 8px | 인접 요소 간격 |
| md | 12px | 카드 내 항목 간격 |
| lg | 16px | 섹션 내 항목 간격 |
| xl | 20px | 카드 패딩 |
| 2xl | 24px | 섹션 상하 패딩 |
| 3xl | 28px | 섹션 헤더 마진 |
| 4xl | 32px | 큰 섹션 간격 |
| section | 64~96px | 데스크탑 섹션 여백 |

---

## Layout

### Frame

> **기본 뷰는 데스크탑(웹)이며, 모바일도 동등하게 지원한다.**
> 모바일 전용 앱처럼 440px에 고정하지 않는다. 데스크탑에서는 웹사이트처럼 넓게 표시하고, 모바일에서는 반응형으로 최적화한다.

```
모바일 (< 900px) : max-width 440px, background #fff, centered on #eef0f3
데스크탑 (≥ 900px): max-width 1200px (frame), content max-width 1100px, centered
브레이크포인트   : 900px — Tailwind `md:` 커스텀 오버라이드 적용
```

**반응형 레이아웃 규칙**
- UserLayout 프레임: `max-w-[440px] md:max-w-[1200px]`
- 페이지 내 콘텐츠 래퍼: `md:max-w-[1100px] md:mx-auto md:px-7`
- 모든 그리드는 모바일 기준으로 시작해 데스크탑에서 확장 (`grid-cols-1 md:grid-cols-N`)

### Section Rhythm (Apple·IBM 방식)

홈 페이지는 배경색 교차만으로 섹션을 구분한다. 구분선·그림자 없음.

```
Section 1  [#ffffff]  HERO — 슬라이더
Section 2  [#f4f4f6]  합격 실적 stats
Section 3  [#ffffff]  WHY 인코딩플러스
Section 4  [#f4f4f6]  개설 강좌 미리보기
Section 5  [#0ea5e9]  CTA 배너 (파란 배경)
Footer     [#18181b]  푸터 (다크)
```

### Grid

| 컨텍스트 | 모바일 | 데스크탑 |
|---------|--------|---------|
| Stats | 2열 | 4열 |
| 특징 카드 | 1열 | 3열 |
| 강좌 카드 | 1열 | 2열 |
| 블로그 카드 | 1열 | 3열 |

---

## Border Radius

| Token | Value | 용도 |
|-------|-------|------|
| sm | 6px | 배지, 태그 |
| md | 8~9px | 버튼, 소형 카드 |
| lg | 10~11px | 버튼 (주요), 인풋 |
| xl | 12~14px | 카드 (소) |
| 2xl | 16px | 카드 (표준) |
| 3xl | 18~20px | 강좌 카드, 모달 |
| full | 999px | progress bar, 도트 |

---

## Elevation & Shadow

IBM처럼 그림자를 최소화한다. 깊이는 배경색 대비로 표현.

| 용도 | Shadow |
|------|--------|
| 기본 카드 | 없음 (테두리 1px `#ececef`만) |
| 강조 카드 | `0 0 50px rgba(24,24,27,.08)` |
| 모달 / Drawer | 배경 오버레이 `rgba(24,24,27,.45)` |
| Top nav | `backdrop-filter: blur(10px)` |

---

## Components

### Buttons

```
Primary   : bg #0ea5e9, text #fff, radius 10~11px, padding 14~15px 20~28px, weight 700
Secondary : bg #fff, border 1px #e5e5ea, text #52525b, radius 10~11px
Ghost     : bg none, text #0ea5e9, weight 600
Disabled  : bg #bae6fd, text #fff, cursor not-allowed
Danger    : bg #fef2f2, text #ef4444 (삭제·경고용)
```

**규칙**
- 뷰포트당 Primary 버튼 1개 원칙
- 버튼 텍스트 15~16px, weight 700
- pill(999px) 사용 안 함 — 10~11px 유지

### Cards

```
Standard  : bg #fff, border 1px #ececef, radius 14~16px, padding 20px
Course    : radius 16~20px, header bg 코스 색상, body padding 20px
Stat      : border 1px #ececef, radius 12px, padding 15px, 숫자 27px 800
Feature   : bg #fff, border 1px #ececef, radius 14px, padding 20px, 아이콘박스 44px
Blog      : overflow hidden, 이미지 150px, 하단 패딩 16~18px
```

### Form Inputs

```
Text input : border 1px #e5e5ea, radius 10px, padding 13px 14px, font 15px
            focus: border #0ea5e9 (outline none)
Radio/Check: 커스텀 스타일, 선택시 border #0ea5e9 + bg #f0f9ff
Select     : border 1px #e5e5ea, radius 10px, bg #fff
Textarea   : 동일, resize vertical, min-height 180px
```

### Navigation

```
TopNav 모바일  : height 56px, sticky, blur backdrop, 로고 + 햄버거
TopNav 데스크탑: height 72px, sticky, blur backdrop, 로고 + 링크 + CTA 버튼
BottomNav      : height 64px, fixed, 4탭 (홈/수업/신청/블로그)
Drawer         : 우측 슬라이드 300ms ease, 오버레이 클릭 시 닫힘
AdminTopBar    : height 56px, 관리자 + 배지 + 나가기
```

### Badges & Tags

```
Primary badge  : bg #eaf6fe, text #0284c7, radius 6px, padding 3~5px 8~10px, weight 600~700
Error badge    : bg #ef4444, text #fff, "신규" 표시
Course tag blue: bg #eaf6fe, text #0284c7
Course tag purple: bg #f5f3ff, text #6d28d9
```

### Progress Bar

```
Track  : bg #f0f0f3, height 6px, radius 999px
Fill   : bg #0ea5e9, transition width 0.3s
```

### Bottom Sheet Modal

```
Overlay   : bg rgba(24,24,27,.45), fixed inset-0
Sheet     : bg #fff, radius 20px 20px 0 0, max-height 88vh, overflow auto
Handle    : width 42px, height 5px, bg #e5e5ea, radius 999px, margin 8px auto
```

---

## Iconography

이모지 아이콘 사용 (외부 아이콘 라이브러리 없음):

| 컨텍스트 | 이모지 |
|---------|--------|
| 홈 탭 | 🏠 |
| 수업 탭 | 📚 |
| 신청 탭 | ✏️ |
| 블로그 탭 | 📝 |
| 관리자 신청현황 | 📋 |
| 관리자 폼편집 | 📝 |
| 관리자 배너 | 🖼️ |
| Feature 카드 아이콘 배경 | 44×44px, bg #eaf6fe, radius 12px |

---

## Page-Specific Rules

### Home

- Hero: 슬라이더 4개, 4.5초 자동전환, 도트 네비게이션
- Stats: 파란 숫자(27px 800) + 회색 레이블, 2×2 그리드
- WHY: 아이콘 박스 + 제목(16px 700) + 설명(14px 회색)
- 강좌 미리보기: "전체보기 →" 링크 우상단, 카드 하단에 가격 + "신청하기 →"
- **월 수강료는 선택 표시**: 가격이 비어 있거나 `null`이면 가격 영역 전체를 렌더링하지 않는다. 하드코딩 금지 — Firestore 또는 상수에서 읽어 `null/''`이면 숨김 처리.

### Courses

- 코스 헤더: 코스 색상 배경, 흰 텍스트
- bottom sheet로 상세 열기 (페이지 이동 없음)
- 비교 테이블: 헤더 `#18181b` 다크, 2행 교차(흰/회색)
- **월 수강료 표시 선택**: 가격이 없으면 해당 행/셀 숨김 처리. 비교 테이블도 동일.

### Apply (3단계 폼)

- Progress bar 상단 고정
- 단계 표시: "1 / 3" 우상단
- 각 질문: 흰 카드, Q번호 회색, 레이블 굵게
- 동의 "아니오" → 다음 버튼 비활성 처리
- 제출 완료: 오버레이 모달, ✓ 아이콘, 홈으로 버튼

### Blog

- 카드 이미지: 하드코딩 URL (Storage 없음)
- 카테고리: Primary Light 배지
- 상세: 본문 16px 1.8 line-height, 하단 상담 CTA 박스

### Admin

- 색상: Primary를 `#0284c7`(sky-600)로 사용 (사용자 Primary보다 진하게)
- 밀도: Linear 스타일 — 정보 압축, 패딩 최소화
- 신규 배지: `#ef4444` 레드
- 확인처리 버튼: Primary 전체폭

---

## Do's & Don'ts

### Do
- Primary 색상(`#0ea5e9`)은 CTA 버튼, 링크, active 상태에만
- 섹션 구분은 배경색 교차(흰↔회색)로만
- 헤드라인은 항상 weight 800 + negative letter-spacing
- 카드 테두리는 `1px solid #ececef`로 통일
- 숫자(합격생수, 수강료)는 크고 굵게 — 신뢰의 핵심
- 모든 인터랙티브 요소 최소 터치 타깃 44px

### Don't
- 두 번째 포인트 색상 추가 금지 (코스 purple 제외)
- 그라디언트 배경 사용 금지
- pill 버튼(radius 999px) 사용 금지
- 카드에 그림자 중첩 금지 (테두리 하나로)
- 데스크탑에서도 모바일용 하단 탭 노출 금지
- `font-weight: 400` 헤드라인 금지

---

## Agent Prompt Guide

이 디자인 시스템으로 컴포넌트를 만들 때:

1. 폰트는 항상 Pretendard (이미 전역 설정됨)
2. 색상은 위 팔레트만 사용, Tailwind 색상 클래스 혼용 최소화
3. 인라인 스타일과 Tailwind 혼용 가능하나, 색상·폰트는 인라인 스타일 우선
4. 브레이크포인트는 900px 기준 (Tailwind `md:` 아님 — 커스텀 필요)
5. 모든 버튼에 `cursor: pointer` 명시
6. 인터랙티브 상태(hover, active, focus)는 색상 변화로만 표현
