# 인코딩플러스 작업 현황 (2026-06-27 v4)

---

## 완료된 작업

### 핵심 버그 수정
- [x] Firestore 보안 규칙: `/{document=**}` 전체 허용으로 수정 (`firestore.rules`)
- [x] 초안 저장 버그: `date: undefined` → 조건부 spread로 수정
- [x] AdminBlogList 문법 오류: map 블록 닫는 괄호 누락
- [x] AdminBanners 타입 오류: `typeof sheet === 'object'` 타입 가드

### 디자인 / 색상
- [x] 보라/인디고 계열 전부 → 파란색 계열로 교체
- [x] 테두리 색 강화: `#c8d0dc` 통일
- [x] body 배경 `#eff6ff` (blue-50) 통일
- [x] CTA 버튼 색상: `#0099D6` → `#2563eb` 통일

### 레이아웃
- [x] AdminLayout ↔ UserLayout 너비 구조 통일 (1200px 외부 + 1100px 내부)
- [x] 관리자 로고: `인코딩플러스.` + `관리자` 뱃지
- [x] AdminSubmissions: 목록 섹션 화면 높이 꽉 채움 (flex: 1)

### 섹션 제목 패턴
- [x] 파란 바(3px) + 영문 라벨 + 한글 제목 → AdminSubmissions, AdminFormList, AdminBanners, AdminBlogList
- [x] FormBuilder, AdminBlogWrite는 파란 바 없음

### FormBuilder
- [x] 파란 바 제거, 취소 버튼 추가
- [x] overflow: hidden 제거 → 질문 추가 드롭다운 잘림 해결

### AdminBlogWrite
- [x] 블록 에디터 → **마크다운 에디터** (preview 탭 전환)
- [x] Sticky 헤더 흰색 배경
- [x] Firestore 초안 저장 (`published: false`)
- [x] 편집 모드 헤더에 `초안` / `발행됨` 뱃지
- [x] 대표 이미지 URL 힌트 텍스트 및 placeholder 추가 (배너와 동일 패턴)

### AdminBlogList
- [x] 리스트 → 3열 그리드 카드
- [x] 핀 토글: 이미지 우상단 오버레이 버튼
- [x] 발행/비공개 토글 버튼 (카드 하단)

### Blog.tsx (사용자)
- [x] 핀 고정 글 최상단 별도 섹션 (최대 3개)
- [x] `published !== false` 글만 표시 (기존 글 하위 호환)
- [x] 날짜 ← / 조회수 →
- [x] 카드 그리드 높이 통일: `gridAutoRows: '1fr'` + 카드 `height: 100%`
- [x] 요약 미잘림: line-clamp 제거
- [x] 사용자 목록 핀 아이콘 제거 (관리자 전용)

### BlogPost 상세 페이지
- [x] 조회수 카운트: 진입 시 Firestore `views` increment
- [x] 초기 조회수 설정 스크립트 (`scripts/setInitialViews.mjs`) — 4개 포스트 적용
- [x] 디자인 점검: 해시태그 배경 `#dbeafe`, 테두리 `#c8d0dc`, safe-area 적용

### AdminBanners
- [x] 배경 그라데이션 프리셋 8개
- [x] 배너 이미지 지원: URL 입력 → 전체 배경 이미지로 렌더링
- [x] 이미지 설정 시 색상 선택 비활성화 (opacity 0.4)
- [x] 미리보기 텍스트/버튼 흰색

### Home.tsx
- [x] 배너 이미지 렌더링: image → backgroundImage, 오버레이 강화
- [x] 배너 CTA 자동 레이블: `CTA_LABELS[b.link] || b.cta`
- [x] "개설강좌" → "입시 특강" 명칭 변경
- [x] COURSE 02: "일반전형 특강", 세부항목 순서 변경, "16주" 명시
- [x] WHY 섹션 리디자인: 구조화된 카드 3개
- [x] WHY 섹션 배포 환경 수정: `gridAutoRows` 제거 → `alignItems: stretch`
- [x] 수업 상세 버튼: 텍스트 링크 → `#2563eb` CTA 버튼 스타일
- [x] 코스 카드 색상: COURSE 01 배경 `#dbeafe` → `#eff6ff`, accent `#2563eb` 통일

### Courses.tsx
- [x] 페이지 헤더 부제 삭제, 전형 안내 블록·섹션 헤더 제거
- [x] 바텀시트 제거 → CourseFullCard 전면 표시
- [x] 상세 단락 `p` → `div` (브라우저 기본 margin 제거)

### Apply.tsx
- [x] Step1 하드코딩 (개인정보 동의 + 수업 선택), Step2 유의사항, Step3 수업별 섹션
- [x] info 타입 질문 → 공지 카드로 렌더
- [x] 필수 radio '아니오' 선택 시 경고 메시지 + Next 차단
- [x] 유의사항 Firestore 연동 (없으면 하드코딩 NOTICES 폴백)
- [x] Step3: 수업명 정확 매칭 → 없으면 "준비 중" 표시
- [x] `detail` 저장: `{질문레이블: value}` 형식
- [x] 디자인 점검: 테두리 `#c8d0dc` 통일, 비활성 버튼 `#bfdbfe`
- [x] Step1 신청 확인 섹션 info 질문 Firestore에서 렌더링 (PDF 링크 포함), 폴백 유지
- [x] Step1 개인정보 안내문 별도 info 카드로 분리

### AdminSubmissions
- [x] forms 컬렉션 조회 → questionId:label 매핑 빌드
- [x] detail: UUID 키 → labelMap 통해 한국어 레이블 치환
- [x] 상세 응답 그리드 레이아웃: `grid-template-columns: auto 1fr`

### enrollmentTemplate.ts / Firestore 폼
- [x] 4섹션 구조: 신청 확인 / 유의사항 / 입시 단기특강 / 일반전형 특강
- [x] 섹션 제목 Apply.tsx 매칭 키워드와 정확히 일치
- [x] Firestore 재생성 (`scripts/resetEnrollmentForm.mjs`), `createdAt` 포함

### 이미지 / 파일 관리
- [x] 이미지 관리 규칙: `public/` 로컬 저장 → 절대경로 입력 방식
- [x] `public/blog/` 폴더 생성 (블로그 대표 이미지 6개)
- [x] `public/files/` 폴더 생성 + xlsx 2개 (`2027_교과점수계산기.xlsx`, `2028_교과점수계산기.xlsx`)

### 프로젝트 이름 변경
- [x] GitHub 레포: `form-pwa` → `encodingplus`
- [x] 로컬 폴더: `/folder/form-pwa` → `/folder/encodingplus`
- [x] git remote URL: `https://github.com/jisoo-git/encodingplus.git`
- [x] Vercel 프로젝트명 변경 → 배포 URL: `https://encodingplus.vercel.app/`

### Types
- [x] `Post.content: ContentBlock[]` → `content: string` (마크다운)
- [x] `Post`: `pinned?`, `views?`, `published?` 필드 추가
- [x] `banners`: `image?` 필드 추가

### plan / 문서
- [x] `plan/DESIGN.md` YAML 토큰 + 섹션별 서술 구조로 전면 재작성 (BMW 스타일)
- [x] `CLAUDE.md` 이미지 관리 규칙, 배포 URL, files 폴더 규칙 반영

---

## 미완료 / 이어서 할 작업

### 기능 (우선순위 높음)
- [ ] **폼 활성화 자동 비활성화**: 한 폼 활성화 시 나머지 자동 비활성화 미구현

### 기능 (우선순위 낮음)
- [ ] **이미지 업로드 UI**: 현재 로컬 `public/` 폴더 + 경로 입력 방식. 관리자 UI 업로드 기능 미구현

---

## 참고
- 디자인 가이드: `plan/DESIGN.md`
- 로컬 경로: `/Users/leejisoo/folder/encodingplus`
- GitHub: `https://github.com/jisoo-git/encodingplus`
- 배포 URL: `https://encodingplus.vercel.app/`
- Firebase 설정: `src/firebase/config.ts` (하드코딩)
- Firestore 규칙: `firestore.rules` (전체 허용)
- Firestore 폼 재생성 스크립트: `scripts/resetEnrollmentForm.mjs`
