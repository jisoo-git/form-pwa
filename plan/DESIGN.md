# 인코딩플러스 디자인 가이드

> 이 문서는 인코딩플러스 웹사이트의 디자인 시스템 단일 기준서입니다.  
> 코드 작업 전 반드시 참고하고, 변경 시 이 문서를 함께 업데이트하세요.

---

## 1. 색상 시스템 (Blue-600 기준)

> 주색은 파란색 계열만 사용. 보라·인디고 계열 사용 금지.

### 주색 팔레트

| 역할 | Hex | Tailwind | 사용처 |
|------|-----|----------|--------|
| 주색 (CTA) | `#2563eb` | `blue-600` | 버튼, 강조 레이블, 파란 바 |
| 주색 어둠 | `#1d4ed8` | `blue-700` | 뱃지 텍스트, hover 상태 |
| 주색 더 어둠 | `#1e40af` | `blue-800` | 강조 텍스트 |
| 주색 연함 | `#dbeafe` | `blue-100` | 뱃지 배경, 활성 탭 배경 |
| 주색 최연함 | `#eff6ff` | `blue-50` | 정보 박스, body 배경 |
| 주색 테두리 | `#bfdbfe` | `blue-200` | 인풋 포커스 테두리, 배지 테두리 |
| 주색 중간 테두리 | `#93c5fd` | `blue-300` | 버튼 테두리, 점선 |

### 텍스트 팔레트

| 역할 | Hex | 사용처 |
|------|-----|--------|
| 텍스트 기본 | `#18181b` | 제목, 본문 |
| 텍스트 보조 | `#52525b` | 서브텍스트, 보조 버튼 |
| 텍스트 약함 | `#71717a` | 메타 정보 |
| 텍스트 최약 | `#8c959f` | 플레이스홀더, 뒤로 버튼 |
| 텍스트 흐림 | `#a1a1aa` | 날짜, 조회수 |

### 배경 팔레트

| 역할 | Hex | 사용처 |
|------|-----|--------|
| body 배경 | `#eff6ff` | 전체 페이지 배경 (blue-50) |
| 카드 배경 | `#fff` | 카드, 시트 |
| 보조 배경 | `#f4f4f6` | 보조 버튼, 섹션 헤더, stat 카드 |
| 연보조 배경 | `#f9fafb` | 비활성 버튼 |

### 기능 색상

| 역할 | Hex | 사용처 |
|------|-----|--------|
| 성공 | `#22c55e` / `#dcfce7` | 활성 토글, 상담완료 뱃지 |
| 경고 (삭제) | `#ef4444` / `#fee2e2` | 삭제 버튼 |
| 주의 | `#a16207` / `#fef9c3` | 새 신청 뱃지 |

### 구분선 / 테두리

| 역할 | Hex | 사용처 |
|------|-----|--------|
| 기본 테두리 | `#c8d0dc` | 카드, nav 하단선, 인풋 기본 |
| 연한 구분선 | `#d4d9e0` | 아이템 구분선 |

---

## 1-1. 로고 규칙

```
인코딩플러스+
```
- `인코딩플러스` — `#18181b`, fontWeight 800
- `+` — `#2563eb` (blue-600), 동일 fontWeight/size
- 모바일 18px / 데스크탑 21px
- 관리자: `인코딩플러스+` 뒤에 `관리자` 뱃지 (blue-100 배경, blue-700 텍스트)

---

## 2. 레이아웃 구조

### 전체 너비 규칙
**흰 배경이 뷰포트 100% 꽉 차야 함 — max-width 제한 없음.**  
양 옆 회색 배경 노출 금지.

### 공통 Wrapper 패턴

```tsx
// UserLayout / AdminLayout 공통 — 전체 너비 흰 배경
<div style={{ minHeight: '100vh', background: '#fff' }}>
  <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
    {/* 내용 */}
  </div>
</div>
```

내부 콘텐츠 섹션은 각자 max-width 처리:
```tsx
<div style={{ padding: '0 18px' }} className="md:max-w-[1100px] md:mx-auto">
```

### 페이지 내부 섹션 패턴

```tsx
// 섹션 내부 콘텐츠 — 항상 이 패턴으로
<div style={{ padding: '24px 18px 32px' }} className="md:max-w-[1100px] md:mx-auto">
  {/* 페이지 제목 */}
  <div style={{ marginBottom: 16 }}>
    <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
    <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em' }}>섹션영문명</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: '#18181b', marginTop: 2 }}>한글 제목</div>
  </div>
  {/* 본문 */}
</div>
```

### 모바일 (< 900px)
- 좌우 padding: `18px`
- BottomNav 높이 64px → 하단 여백 확보 필수
- `env(safe-area-inset-bottom)` 적용

### 데스크탑 (≥ 900px)
- 레이아웃 최대 너비: `1200px` (흰 박스)
- 콘텐츠 최대 너비: `1100px` (내부 컨테이너)
- TopNav 높이: 72px (모바일 56px)

---

## 3. 네비게이션

### 사용자 (UserLayout)
```
TopNav: 인코딩플러스. [로고] ←좌측 | 홈·수업소개·블로그·수강신청→ ←우측
BottomNav: 홈·수업소개·블로그·수강신청 (모바일 only)
```

### 관리자 (AdminLayout)
```
TopNav: 인코딩플러스. 관리자 [로고] ←좌측 | 신청현황·폼편집·홍보배너·블로그·홈으로→ ←우측
BottomNav: 신청현황·폼편집·홍보배너·블로그 아이콘 탭 (모바일 only)
```

- 로고 구조: `인코딩플러스` + `.` (blue-600) + `관리자` 뱃지 (blue-100/700)
- 활성 탭: `background: #dbeafe`, `color: #1d4ed8`, `fontWeight: 700`
- 비활성 탭: `color: #52525b`, `fontWeight: 500`, hover → `.nav-btn` CSS class
- 홈으로 버튼: `background: #2563eb`, 흰 텍스트, `hover-btn` class

---

## 4. 섹션 제목 패턴

홈페이지와 관리자 **목록 페이지**에 동일하게 적용.  
**예외: FormBuilder, AdminBlogWrite 에는 파란 바 없음** (작성/편집 플로우는 청결한 헤더 사용).

적용 대상: AdminSubmissions, AdminFormList, AdminBanners, AdminBlogList

```tsx
<div style={{ marginBottom: 16 }}>
  {/* 파란 바 */}
  <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
  {/* 영문 라벨 */}
  <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em' }}>SECTION</div>
  {/* 한글 제목 */}
  <div style={{ fontSize: 26, fontWeight: 800, color: '#18181b', letterSpacing: '-0.03em', marginTop: 4 }}>제목</div>
  {/* 부제 (선택) */}
  <div style={{ fontSize: 14, color: '#71717a', marginTop: 8 }}>부제목</div>
</div>
```

---

## 5. 카드 컴포넌트

### 기본 카드
```tsx
<div
  className="hover-card"
  style={{
    background: '#fff',
    border: '1px solid #c8d0dc',
    borderRadius: 16,
    overflow: 'hidden',
  }}
/>
```
- `hover-card` CSS class: `shadow + translateY(-2px)` on hover
- 파란 hover shadow: `rgba(37, 99, 235, 0.13)`

### 관리자 카드 (활성 강조)
```tsx
border: form.isActive ? '1px solid #86efac' : '1px solid #c8d0dc'
// 또는 고정글:
border: post.pinned ? '2px solid #2563eb' : '1px solid #c8d0dc'
```

### 섹션 카드 (테두리 구분)
```tsx
style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: '16px' }}
```

---

## 6. 버튼 패턴

### Primary CTA
```tsx
style={{
  background: '#2563eb', border: 'none', color: '#fff',
  fontWeight: 700, fontSize: 14, padding: '9px 18px',
  borderRadius: 10, cursor: 'pointer',
}}
className="hover-btn"
```

### Secondary
```tsx
style={{
  background: '#f4f4f6', border: 'none', color: '#52525b',
  fontWeight: 700, fontSize: 13, padding: '9px 16px',
  borderRadius: 8, cursor: 'pointer',
}}
```

### Danger (삭제)
```tsx
style={{
  background: '#fff', border: '1px solid #fee2e2', color: '#ef4444',
  fontWeight: 700, fontSize: 13, padding: '9px 12px',
  borderRadius: 8, cursor: 'pointer',
}}
```

### Inactive / 비활성
```tsx
style={{
  background: '#93c5fd', border: 'none', color: '#fff',
  cursor: 'not-allowed',
}}
```

---

## 7. 폼 인풋 패턴

```tsx
<input
  style={{
    width: '100%', border: '1px solid #c8d0dc', borderRadius: 10,
    padding: '11px 14px', fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  }}
  onFocus={e => { e.target.style.borderColor = '#2563eb' }}
  onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
/>
```

### 필드 컨테이너 (AdminBlogWrite 패턴)
```tsx
<div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 12, padding: '16px 18px' }}>
  <div style={{ fontSize: 12, fontWeight: 700, color: '#52525b', marginBottom: 10 }}>라벨</div>
  {children}
</div>
```

---

## 8. 뱃지 / 태그 패턴

### 파란 뱃지
```tsx
<span style={{
  fontSize: 11, fontWeight: 700,
  background: '#dbeafe', color: '#1d4ed8',
  padding: '2px 8px', borderRadius: 6,
}}>
  텍스트
</span>
```

### 해시태그 pill
```tsx
<span style={{
  fontSize: 12, fontWeight: 700, color: '#2563eb',
  background: '#dbeafe', borderRadius: 999,
  padding: '4px 12px',
}}>
  #태그
</span>
```

---

## 9. Bottom Sheet (모달)

```tsx
// 반드시 CSS class 사용 — inline maxWidth 금지
<div className="course-sheet-overlay" style={{ zIndex: 60 }} onClick={onClose}>
  <div className="course-sheet-panel" onClick={e => e.stopPropagation()}>
    {/* 핸들바 */}
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
      <div style={{ width: 36, height: 4, borderRadius: 2, background: '#c8d0dc' }} />
    </div>
    {/* 내용 */}
  </div>
</div>
```

| 구분 | 모바일 | 데스크탑 |
|------|--------|----------|
| 위치 | 하단 슬라이드 | 중앙 다이얼로그 |
| border-radius | 20px 20px 0 0 | 16px |
| max-width | 100% | 640px |

---

## 10. 배너 (히어로 슬라이더)

### 배경 종류
- **그라데이션** (`bg` 필드): `background: b.bg`
- **이미지** (`image` 필드): `backgroundImage: url(...)`, `backgroundSize: cover`
- 이미지 우선 — image가 있으면 bg 무시

### 배경 그라데이션 프리셋

```
진파랑:    linear-gradient(135deg, #002B5C 0%, #2563eb 100%)
네이비:    linear-gradient(135deg, #001233 0%, #003580 100%)
미드블루:  linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)
딥블루:    linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)
스카이:    linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)
하늘:      linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)
라이트블루: linear-gradient(135deg, #0ea5e9 0%, #93c5fd 100%)
다크:      linear-gradient(135deg, #18181b 0%, #374151 100%)
```

### 배너 텍스트 / CTA 규칙
- 텍스트 전부 **흰색** (`#fff`, `rgba(255,255,255,0.72)`, `rgba(255,255,255,0.78)`)
- 오버레이: 그라데이션 `rgba(0,0,0,0.35→0.08)`, 이미지 `rgba(0,0,0,0.55→0.15)` (더 강하게)
- CTA 버튼: `background: #fff`, `color: #18181b` (흰 버튼, 검은 글씨)
- **CTA 레이블**: `b.cta` 직접 사용 금지 — `CTA_LABELS[b.link] || b.cta` 패턴으로 링크 기반 자동 도출
  ```ts
  const CTA_LABELS = { '/apply': '수강 신청하기', '/courses': '수업 보기', '/blog': '블로그 보기' }
  ```

---

## 11. 블로그

### 블로그 카드 구조
```
[대표 이미지 150px 고정]
[#태그 · 제목 · 요약]
[날짜 ←좌 / 조회수 →우]
```

### 블로그 카드 그리드 규칙
- 그리드: `gridAutoRows: '1fr'` — 같은 행의 카드 높이 통일
- 카드: `height: 100%` 필수 — grid row를 꽉 채움
- 요약(excerpt): line-clamp 없음 — 전체 표시, `flex: 1`로 남은 공간 흡수

### 고정글 시스템
- 관리자 블로그 목록에서 📌 버튼으로 최대 3개 고정
- 고정글은 사용자 블로그 최상단에 별도 섹션으로 표시
- 고정 카드 (관리자): `border: 2px solid #2563eb`
- **사용자 블로그 목록에는 📌 핀 아이콘 표시 안 함** (관리자 전용)

### 날짜/조회수 표시
```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#a1a1aa' }}>
  <span>{post.date}</span>
  <span>조회수 {post.views ?? 0}</span>
</div>
```

### 핀 토글 (관리자 목록)
- 이미지 div 위에 `position: absolute, top: 8, right: 8` 배치
- 고정됨: `background: #2563eb`, border 없음
- 미고정: `background: rgba(255,255,255,0.22)`, `border: 1px solid rgba(255,255,255,0.45)`, `backdropFilter: blur(4px)` (히어로 배너 앞뒤 버튼과 동일)
- 크기: `width: 32, height: 32, borderRadius: 8`

### AdminBlogWrite 헤더
```tsx
// Sticky 헤더 — 흰 배경 (파란색 아님)
background: 'rgba(255,255,255,0.96)'
// 버튼 순서: 취소 | 임시저장 (신규만) | 발행하기
// 임시저장: localStorage 저장 후 시간 표시 ("임시저장 14:32")
```

---

## 12. CSS 유틸리티 (index.css)

| 클래스 | 동작 |
|--------|------|
| `hover-card` | 카드 hover: shadow + translateY(-2px) |
| `hover-btn` | 버튼 hover: brightness(0.9) + translateY(-1px) |
| `nav-btn` | 네비 버튼 hover: background #dbeafe, color #1d4ed8 |
| `dark-cta-bottom` | 다크 섹션 모바일 하단 여백 (BottomNav 위) |
| `apply-btn-area` | 수강신청 하단 버튼 영역 |
| `step-indicator` | 수강신청 스텝 표시 sticky |
| `course-sheet-overlay` | Bottom Sheet 오버레이 (반응형) |
| `course-sheet-panel` | Bottom Sheet 패널 (반응형) |
| `blog-list-bottom` | 블로그 목록 하단 여백 |

---

## 13. 폰트 / 타이포그래피

- 폰트: `Pretendard` (400/500/600/700/800)
- letterSpacing: 제목 `-0.03em`, 영문 라벨 `0.06~0.08em`
- 본문 lineHeight: `1.55~1.6`
- 제목 lineHeight: `1.25~1.35`

---

## 14. Firebase 스키마

| 컬렉션 | 주요 필드 |
|--------|----------|
| `banners` | `badge, title, sub, bg(gradient), image?, cta, link, order` |
| `blogPosts` | `tag, title, excerpt, coverImage, content: string(markdown), date, read, pinned?, published?, views?` |
| `submissions` | `name, course, school, phone, status, submittedAt, detail` |
| `forms` | `title, description, type, isActive, sections: Section[]` |

### Firebase 연결 방식
- Firebase 설정은 `src/firebase/config.ts`에 **하드코딩** (환경변수 없음)
- Auth 없음 — `firestore.rules`에서 `/{document=**} allow read, write: if true` 전체 허용
- 블로그/배너/신청 CRUD 모두 Firestore 직접 연동
- Apply.tsx 신청 폼은 현재 **하드코딩된 질문** 사용 (Firestore forms 컬렉션 미연동)
  → `forms.isActive` 토글은 블로그 `published`와 같은 개념 (공개/비공개), 현재 UI 표시용

### Firestore 규칙 배포
규칙 수정 후 반드시 배포 필요:
```bash
firebase deploy --only firestore:rules
```

---

## 15. 페이지별 특이사항

| 페이지 | 주의 |
|--------|------|
| FormBuilder | 파란 바 없음. 헤더: `← 폼 목록으로` + 제목 좌측, `취소` + `저장` 우측. `overflow: hidden` 제거 (드롭다운 클리핑 방지) |
| AdminBlogWrite | 파란 바 없음. Sticky 헤더 흰색. 버튼: 취소·임시저장(신규)·발행하기 |
| AdminSubmissions | 필터+목록 섹션 `flex: 1` — 페이지 높이를 꽉 채움 |

---

## 16. 체크리스트 (PR 전 확인사항)

- [ ] 보라/인디고 계열 색상 없는지 확인
- [ ] 카드 테두리 `#c8d0dc` 이상인지 확인
- [ ] 페이지 제목에 파란 바(3px) + 영문 라벨 있는지 확인
- [ ] 모바일 padding 18px, 데스크탑 max-w-[1100px] 패턴인지 확인
- [ ] inline style에 maxWidth 넣지 않았는지 (Bottom Sheet)
- [ ] BottomNav safe-area 적용 여부
- [ ] `npx tsc --noEmit` 통과 여부
