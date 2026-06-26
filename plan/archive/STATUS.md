# 인코딩 플러스 폼 PWA — 개발 현황

> **요약 (3줄):**
> 1. **무엇을 쓰는 파일?** 진행 현황 체크리스트 — 완료된 것, 남은 것, 보류 중인 결정 3가지 섹션으로 구성.
> 2. **현재 상태?** 핵심 기능 구현 완료. UI/UX 전면 개선 중 (2026-06-25 작업). 보안 복원 + 미결 디자인 결정 남음.
> 3. **언제 참고?** "지금 뭐가 남았나?" "내일 뭐 해야 하나?" 확인할 때 가장 먼저 열어볼 파일.

_최종 업데이트: 2026-06-25_

---

## 완료된 것 ✅

### 기능 구현 (#1~9)

| # | 항목 | 비고 |
|---|------|------|
| - | Pretendard 폰트 + 전역 스타일 | `src/index.css` |
| - | Tailwind md: 브레이크포인트 900px 오버라이드 | |
| - | UserLayout / AdminLayout | |
| - | TopNav / BottomNav / Drawer | |
| - | App.tsx 라우트 재설계 | |
| 2 | Home.tsx | 슬라이더, 합격실적, WHY, 강좌미리보기, CTA |
| 3 | Courses.tsx | 전형가이드, 타임라인, 강좌상세, 비교표 |
| 4 | Apply.tsx | 3단계 폼, Firebase 제출, 성공 모달 |
| 5 | Blog.tsx / BlogPost.tsx | 카테고리 탭, Firebase 연동, 하단 CTA |
| 6 | AdminSubmissions | 접수 목록, 상태 필터, 상세 bottom sheet |
| 7 | FormBuilder | DnD 유지, inline style 전면 교체 |
| 8 | AdminBanners | 배너 CRUD, 순서 DnD, Firebase 연동 |
| 9 | PWA | 앱 이름 "인코딩플러스", 아이콘, manifest |

### UI/UX 개선 (2026-06-25 세션)

| 항목 | 내용 |
|------|------|
| 테마 색상 확정 | 대한항공 계열: Primary `#0099D6` (sky) / Dark `#0075A8` / Light `#e0f4fb` / Ring `#b3e5f5` |
| 색상 전면 교체 | sky-500 `#0ea5e9` → blue-600 `#2563eb` → KA sky `#0099D6` 2단계 교체 완료 |
| 태블릿 레이아웃 | UserLayout `max-w-[440px]` 제거 → 441~899px 전체 너비 |
| BottomNav | `maxWidth: 440` 제거 → 전체 너비 |
| TopNav 경계선 | `#e3e8ee` → `#c8d0dc` (더 진하게) |
| 섹션 구분 방식 | 배경색 교차(`#fff`↔`#fafafa`) + 패딩 52px. 경계선 제거 |
| 섹션 overline | "TRACK RECORD" → "합격 실적" |
| 홈 배너 | 다크 그라디언트 + 오버레이 + 흰 텍스트. 사진 지원 구조(`image?` 필드) 완비 |
| 배너 1 그라디언트 | KA 스타일: `#002B5C → #0099D6` (navy to sky) |
| 홈 CTA 하단 | 버튼·전화 세로 분리, 부제·학원소개·사업자번호 복원 |
| 강좌 카드 클릭 | `onClick → /courses` 추가 |
| 색상 일관성 | `#f0f9ff`, `#c4c4c8`, `#1e3a5f`, `#3b1f6e` 등 비표준 색상 전부 정리 |
| 디자인 시스템 | `plan/DESIGN_SYSTEM.md` 생성 — 색상 토큰, 컴포넌트 규칙, 금지 사항 명문화 |

---

## 내일 해야 할 것 🔴

### 미결 디자인 결정 (먼저 확인 후 구현)

| # | 항목 | 현황 |
|---|------|------|
| D1 | **홈 CTA 하단 높이** | A: 패딩만 줄이기 / B: 부제 삭제+패딩 줄이기 → **결정 필요** |
| D2 | **색상 최종 확정** | KA sky(`#0099D6`) vs blue-600(`#2563eb`) 봤으니 최종 선택 → **결정 필요** |

### 기능 구현

| # | 항목 | 비고 |
|---|------|------|
| F1 | **AdminBanners 이미지 지원** | 배너에 `image` URL 필드 입력란 추가. Firestore `banners` 스키마: `image?` 필드 추가 |
| F2 | **AdminBanners 색상 팔레트 업데이트** | 기존 sky-50 팔레트 → KA 색상 계열로 교체 |
| F3 | **보안 복원** | Firebase 환경변수 `import.meta.env.*` 복원, 비밀번호 검증 재추가 |
| F4 | **Blog 이미지 슬롯** | 블로그 카드 대표 이미지 지원 (REDESIGN.md 미결 사항) |

### 향후 추가 예정 (우선순위 낮음)

| 항목 | 설명 |
|------|------|
| 합격후기 카드 섹션 | Home에 파스텔 카드 격자 (이름·학교·합격연도) |
| FAQ 아코디언 | Courses 또는 Home 하단 |
| 신청 플로우 타임라인 | "신청→상담→반배정→수업" 시각화 |

---

## 발표용 임시 조치 (반드시 복원)

| 파일 | 변경 내용 | 복원 방법 |
|------|-----------|-----------|
| `src/firebase/config.ts` | Firebase 설정 하드코딩 | `import.meta.env.VITE_*` 로 교체 |
| `src/hooks/useAuth.ts` | 비밀번호 검증 제거 | `VITE_ADMIN_PASSWORD` 비교 로직 재추가 |
