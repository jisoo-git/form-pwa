# 인코딩플러스 전면 리디자인 플랜

> **요약 (3줄):**
> 1. **무엇을 쓰는 파일?** 전체 사이트 리디자인의 설계 원본 — 디자인 토큰, 페이지 구조, Firebase 데이터 구조, 구현 순서가 다 있다.
> 2. **현재 상태?** 구현 순서 1~9(레이아웃·홈·수업·신청·블로그·어드민 3종) 완료. #10 보안 복원만 남음.
> 3. **다른 파일과 차이?** STATUS.md = 진행 현황 체크리스트 / DESIGN_REFERENCE.md = 외부 레퍼런스(Stripe·Notion 등) 정리 / 이 파일 = 처음부터 끝까지의 설계 스펙.

_작성일: 2026-06-24_

---

## 1. 디자인 레퍼런스 요약

`plan/design/인코딩플러스.dc.html` 기준. 클로드 디자인 툴로 제작된 목업.

### 디자인 토큰

| 항목 | 값 |
|------|----|
| 폰트 | Pretendard (npm `@fontsource/pretendard`) |
| 배경 | `#eef0f3` |
| 프레임 배경 | `#ffffff` |
| 프레임 최대폭 | 모바일 440px / 데스크탑 1200px |
| Primary | `#0ea5e9` (sky-500) |
| Primary Dark | `#0284c7` (sky-600) |
| 텍스트 | `#18181b` / `#52525b` / `#71717a` |
| 보조 텍스트 | `#9b9ba5` / `#a1a1aa` |
| 테두리 | `#ececef` / `#f0f0f3` |
| 카드 배경 | `#fff` |
| 연한 배경 | `#fafafb` |
| 단기특강 색 | blue (`#0ea5e9` / `#0284c7`) |
| 일반전형 색 | purple (`#7c3aed` / `#6d28d9`) |
| 에러/신규 | `#ef4444` |

### 공통 스타일 규칙

- `box-sizing: border-box`, `-webkit-tap-highlight-color: transparent`
- 스크롤바 숨김 (`::-webkit-scrollbar { width: 0 }`)
- 카드: `border-radius: 14~16px`, `border: 1px solid #ececef`
- 버튼: `border-radius: 10~11px`, `font-weight: 700`
- 상단 nav: `backdrop-filter: blur(10px)`, `background: rgba(255,255,255,.94)`

---

## 2. 페이지 구조

### 사용자 라우트

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | `Home` | 슬라이더 + 실적 + WHY + 강좌 미리보기 + CTA |
| `/courses` | `Courses` | 수업 상세 + bottom sheet 모달 |
| `/apply` | `Apply` | 3단계 수강신청 폼 |
| `/blog` | `Blog` | 블로그 글 목록 |
| `/blog/:id` | `BlogPost` | 블로그 글 상세 |

### 관리자 라우트

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/admin` | `AdminLogin` | 로그인 |
| `/admin/submissions` | `AdminSubmissions` | 수강신청 접수 현황 |
| `/admin/form` | `AdminFormBuilder` | 수강신청 폼 편집 |
| `/admin/banners` | `AdminBanners` | 메인 슬라이더 배너 관리 |

> 기존 `/admin/dashboard`, `/admin/builder`, `/admin/responses/:formId` → 리디자인으로 교체

---

## 3. 네비게이션 구조

### 컴포넌트 트리

```
src/
  layouts/
    UserLayout.tsx      ← 사용자 페이지 공통 래퍼
    AdminLayout.tsx     ← 관리자 페이지 공통 래퍼
  components/
    nav/
      TopNav.tsx        ← 모바일 56px / 데스크탑 72px 통합
      BottomNav.tsx     ← 모바일 전용 4탭
      Drawer.tsx        ← 햄버거 슬라이드 메뉴 (모바일)
      AdminTopBar.tsx   ← 관리자 상단바
      AdminTabBar.tsx   ← 관리자 서브탭 (데스크탑용)
```

### UserLayout 동작

```
[모바일 < 900px]
  TopNav (56px, sticky)        ← 로고 + 햄버거 버튼
  Drawer (overlay, 우측 슬라이드)
  <page content>
  BottomNav (64px, fixed)      ← 홈 / 수업 / 신청 / 블로그

[데스크탑 ≥ 900px]
  TopNav (72px, sticky)        ← 로고 + 링크 4개 + 수강신청 CTA 버튼
  <page content>               ← max-width 1100px, 0 auto
  (하단 탭 없음)
```

### BottomNav 탭 정의

| 아이콘 | 레이블 | 경로 | 활성 조건 |
|--------|--------|------|-----------|
| 🏠 | 홈 | `/` | pathname === '/' |
| 📚 | 수업 | `/courses` | pathname.startsWith('/courses') |
| ✏️ | 신청 | `/apply` | pathname.startsWith('/apply') |
| 📝 | 블로그 | `/blog` | pathname.startsWith('/blog') |

### AdminLayout 동작

```
AdminTopBar (56px, sticky)     ← "관리자 · 인코딩플러스" + 나가기 버튼
AdminTabBar (52px, sticky top-56) ← 신청현황 / 폼 편집 / 홍보배너 (데스크탑)
<page content>
BottomNav (3탭, mobile)        ← 신청현황 / 폼 편집 / 홍보배너
```

### Drawer 메뉴 항목

1. 홈 → `/`
2. 수업 소개 → `/courses`
3. 수강 신청 → `/apply`
4. 입시 블로그 → `/blog`
5. 하단: 상담문의 `010-2838-2391`

---

## 4. 페이지별 상세 설계

### 4-1. Home (`/`)

**섹션 순서:**
1. Hero Slider (자동 4.5초, 수동 도트)
   - 배너 4개 (Firebase `banners` 컬렉션에서)
   - 배경색 전환 animate
   - 데스크탑: 좌우 화살표 버튼 노출
2. 합격 실적 (stats 4칸 그리드: 합격생수 / 디미고 / 특성화 / 연속합격)
3. WHY 인코딩플러스 (feature 카드 3개)
4. 개설 강좌 미리보기 (카드 2개, "전체보기 →" 링크)
5. CTA 배너 (파란 배경, 신청하기 버튼)
6. Footer

### 4-2. Courses (`/courses`)

**섹션 순서:**
1. 페이지 헤더 (COURSE / 수업 소개)
2. 디미고 입시 안내 박스 (전형 3단계 설명)
3. Course 01: 입시 단기특강 (blue)
   - 카드 클릭 → bottom sheet 모달 열림
   - 내용: 월별 커리큘럼, 영역별, 수업 시간, 수강료 + 신청 버튼
4. Course 02: 일반전형 특강 (purple)
5. 비교 테이블 (구분 / 단기특강 / 일반전형)

**Bottom Sheet Modal:**
- 코스 이미지 슬롯
- 상세 텍스트
- 수업 구성 리스트
- 수업 시간 카드
- "수강 신청하기" 버튼 → `/apply`

### 4-3. Apply (`/apply`) — 3단계 폼

**Step 1: 수강 신청 선택**
- Q1. 개인정보 처리방침 안내 (PDF 열기 버튼)
- Q2. 개인 정보 활용 동의 (라디오: 네 / 아니오) *필수*
- Q3. 원하시는 수업 선택 (라디오: 입시 단기특강 / 일반전형 특강) *필수*

**Step 2: 유의사항 확인**
- 유의사항 카드 n개 (Firebase `notices` 컬렉션)
- 체크박스: "위 유의사항을 모두 확인했습니다"

**Step 3: 상세 정보 입력**
- 선택한 수업 기반으로 Firebase `formQuestions` 필드 동적 렌더
- 기본 필드: 학생 이름, 부모님 전화, 학교, 성별, 생년월일, 학생 전화, 수업요일, 비대면 시간
- 제출 → Firestore `submissions` 컬렉션에 저장
- 제출 완료 모달 → 홈으로

**UX 포인트:**
- 상단 progress bar (width transition)
- "이전" 버튼 (Step 1 제외)
- 동의 "아니오" 선택 시 다음 버튼 비활성

### 4-4. Blog (`/blog`, `/blog/:id`)

**목록:**
- 카테고리 태그 + 제목 + 발췌 + 날짜/읽기시간
- 카드 이미지 슬롯

**상세:**
- 본문 단락 렌더
- 하단 CTA 박스 (상담 유도)
- "← 블로그 목록" 뒤로가기

**글쓰기 (관리자만):**
- 카테고리 select
- 제목 input
- 대표 이미지
- 본문 textarea
- 발행/취소

> 블로그 데이터: Firebase `blogPosts` 컬렉션 (id, cat, title, date, read, excerpt, body[])

### 4-5. Admin

**AdminSubmissions:**
- 전체 신청수 / 신규 미확인수 카드
- 신청 목록 (이름, 수업, 학교, 전화, 날짜, 신규 배지)
- bottom sheet: 전체 답변 상세 + "확인 처리 · 연락 완료" 버튼 → status 업데이트

**AdminFormBuilder:**
- 현재 질문 목록 (삭제 가능)
- "+ 주관식 질문" / "+ 객관식 질문" 추가
- "폼 저장하기" → Firestore `formConfig` 저장

**AdminBanners:**
- 배너 카드 목록 (배경색 미리보기, 순서/링크/제목 표시)
- 순서 올리기 / 편집 / 삭제
- "+ 새 홍보 배너 추가"

---

## 5. Firebase 데이터 구조

```
firestore/
  banners/          ← 홈 슬라이더 배너 (id, badge, title, sub, bg, cta, link, order)
  submissions/      ← 수강신청 접수 (name, course, school, phone, date, status, detail{})
  formConfig/       ← 수강신청 폼 질문 목록
    apply/
      questions[]   ← {id, type, label, required, options[]}
  blogPosts/        ← 블로그 글 (id, cat, title, date, read, excerpt, body[])
  settings/
    landing/        ← course1, course2 (폼 연결 ID — 기존 유지)
```

---

## 6. 구현 순서

| 순서 | 작업 | 비고 |
|------|------|------|
| 1 | `@fontsource/pretendard` 설치 + `index.css` 전역 스타일 | 폰트, reset, scrollbar |
| 2 | `UserLayout` + `AdminLayout` 래퍼 | 프레임 구조 |
| 3 | `TopNav` + `BottomNav` + `Drawer` | 네비 컴포넌트 |
| 4 | `App.tsx` 라우트 재설계 | 새 라우트 반영 |
| 5 | `Home` 전면 재작성 | 슬라이더, 실적, WHY, 강좌 미리보기 |
| 6 | `Courses` 신규 | bottom sheet 포함 |
| 7 | `Apply` 3단계 재작성 | Firebase 제출 연동 |
| 8 | `Blog` + `BlogPost` 신규 | Firebase 연동 |
| 9 | Admin 3페이지 리디자인 | Submissions / FormBuilder / Banners |
| 10 | PWA 마무리 | 아이콘, 앱 이름, Storage 규칙 |
| 11 | 보안 복원 | 환경변수, 비밀번호 검증 |

---

## 7. 미결 사항

- [ ] 블로그 글 이미지 → Firebase Storage 업로드 기능 포함 여부
- [ ] AdminFormBuilder → 기존 폼빌더(드래그 정렬 포함)와 어떻게 병합할지
- [ ] Apply 폼 질문 → Firebase 동적 렌더 vs 하드코딩 결정
- [ ] 관리자 진입 → 현재 Home 우상단 "관리자" 텍스트 유지 여부
