# 인코딩플러스 Design System — 코드 기준 규칙서

> **요약 (3줄):**
> 1. **무엇을 쓰는 파일?** 실제 코드에 적용된 디자인 토큰·컴포넌트 규칙 전부. 새 페이지/컴포넌트 만들 때 이 파일만 보면 된다.
> 2. **다른 파일과 차이?** DESIGN.md = 초기 설계 원칙 / DESIGN_REFERENCE.md = 외부 레퍼런스 / **이 파일 = 현재 코드에 실제 적용된 구현 스펙 (정답지)**.
> 3. **언제 쓰나?** 새 컴포넌트 만들기 전, 수정 전, 일관성 점검할 때. 이 파일과 다르면 틀린 것.

_최종 동기화: 2026-06-25_

---

## 0. 왜 이 문서가 필요한가

지금까지 문제: 피드백 받을 때마다 땜질 → 페이지마다 규칙 제각각 → 비전문가처럼 보임.

앞으로 방식:
- **새 컴포넌트·페이지 → 이 문서 먼저 확인 → 토큰/패턴 그대로 적용**
- 규칙이 없는 케이스 → 이 문서에 먼저 추가 → 그 다음 구현
- 피드백 → 문서 업데이트 → 전체 적용 (주먹구구 땜질 금지)
- **디자인 판단이 필요한 변경 → 반드시 먼저 여쭤본 후 구현**

---

## 1. 색상 토큰

> ⚠️ **색상 최종 미확정 (2026-06-25)**: 현재 KA sky `#0099D6` 적용 중. `#2563eb`(blue-600) 또는 KA 계열 중 최종 결정 필요.

### Primary (대한항공 계열 sky blue — 검토 중)
```
Primary       #0099D6   버튼, active 상태, accent bar, 도트, progress fill
Primary Dark  #0075A8   hover, 강조 텍스트, 링크
Primary Light #e0f4fb   배지 배경, 아이콘 배경, 선택 상태 배경
Primary Ring  #b3e5f5   선택된 입력 border, step indicator ring
```

### 코스 구분색
```
Course 01 (단기특강)   #0075A8 / bg #e0f4fb   (KA primary dark)
Course 02 (일반전형)   #6d28d9 / bg #f5f3ff   (violet-700, 고정)
```

### 배너 그라디언트
```
Banner 1 (메인)    linear-gradient(135deg, #002B5C 0%, #0099D6 100%)  — KA navy to sky
Banner 2 (단기특강) linear-gradient(135deg, #1e40af 0%, #0369a1 100%)
Banner 3 (일반전형) linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%) — violet
Banner 4 (실적)    linear-gradient(135deg, #18181b 0%, #27272a 100%)  — dark
```

> 배너는 항상 다크 배경 + 오버레이(`rgba(0,0,0,0.35)→0.08`) + 흰 텍스트.
> `image?` 필드에 URL 넣으면 사진 배경으로 자동 전환.

### 배경·표면
```
Section A    #fff       흰 배경 섹션 (1, 3번째)
Section B    #fafafa    미세 회색 섹션 (2, 4번째) — 경계선 대신 배경으로 구분
Card         #fff       카드 배경
Outer Frame  #eef0f3    UserLayout 최외곽
Dark CTA     #18181b    페이지 최하단 CTA 1개만
```

> **섹션 구분 규칙**: `#fff` ↔ `#fafafa` 교차 + 패딩 52px. 섹션 간 `borderTop` 금지.

### 경계선
```
Nav Border      #c8d0dc    TopNav 하단선 (더 진하게)
Card Border     #e3e8ee    카드, 입력창, 페이지 헤더 내부 구분선
Inner Divider   #f0f0f3    카드 내부 행 구분선
```

> 섹션 `borderTop`은 사용하지 않는다. 카드 border는 `#e3e8ee`.

### 텍스트
```
Ink           #18181b   헤드라인, 주요 본문
Ink Sub       #3f3f46   본문 단락
Ink Muted     #52525b   부제, 설명
Ink Subtle    #71717a   메타, 캡션
Ink Faint     #8c959f   placeholder, 비활성, overline 아닌 보조
Ink Disabled  #a1a1aa   완전 비활성
```

### 시맨틱
```
Error / New     #ef4444   신규 배지, 에러
Success         #22c55e   완료, 활성 토글
Warning         #f59e0b   주의
```

---

## 2. 타이포그래피

**폰트:** Pretendard (400/500/600/700/800 로드됨)

### 텍스트 스케일
```
섹션 overline    11px  700   letterSpacing: '0.1em'   color: Primary
섹션 타이틀      22px  800   letterSpacing: '-0.03em'  color: Ink
페이지 타이틀    26px  800   letterSpacing: '-0.03em'  color: Ink
히어로 타이틀    26px  800   letterSpacing: '-0.03em'  whiteSpace: 'pre-line'
카드 타이틀      16px  800   letterSpacing: '-0.02em'  color: Ink
본문             13px  400   lineHeight: 1.6           color: Ink Sub/Muted
메타/캡션        12px  600   color: Ink Faint
배지/태그        11px  700   letterSpacing: '0.04em'
```

### 헤드라인 규칙
- 항상 fontWeight: 800
- letterSpacing: '-0.03em' (22px 이상), '-0.02em' (18-20px)
- 절대로 fontWeight 400 헤드라인 금지

---

## 3. 간격 시스템

**기본 단위: 8px**

```
4px   아이콘·배지 내부 패딩
8px   연관 요소 gap
12px  카드 내 항목 간격
16px  섹션 내 항목 padding
20px  카드 표준 padding
24px  섹션 헤더 margin-bottom
36-40px  섹션 상하 padding (모바일)
48-56px  섹션 상하 padding (데스크탑, md:)
```

---

## 4. 레이아웃

### 컨테이너 구조
```tsx
// UserLayout 프레임
<div className="w-full max-w-[440px] md:max-w-[1200px]">

// 페이지 내 콘텐츠 래퍼 (모든 섹션에 적용)
<div className="md:max-w-[1100px] md:mx-auto" style={{ padding: '0 20px' }}>

// 좁은 단일 칼럼 (Apply, BlogPost 등)
<div className="md:max-w-[680px] md:mx-auto md:px-7">
```

### 반응형 그리드
```
Stats       grid-cols-2 md:grid-cols-4   gap-3
Feature 카드 grid-cols-1 md:grid-cols-3   gap-3
Course 카드  grid-cols-1 md:grid-cols-2   gap-4
Blog 카드    grid-cols-1 md:grid-cols-3   gap-16px
```

### 브레이크포인트
```
md: 900px  (Tailwind @theme 커스텀 오버라이드)
```

---

## 5. 섹션 구조 패턴

### 규칙 (중요)
1. **배경색은 흰색(#fff) 단일** — 섹션마다 배경색 바꾸지 않는다
2. **섹션 구분은 `borderTop: '1px solid #e3e8ee'` 하나로만**
3. **페이지 최하단에만 `background: '#18181b'` dark CTA 섹션**
4. 섹션 패딩: `padding: '40px 0'` (모바일 기준, 데스크탑은 Tailwind md: 클래스 추가)

### 섹션 헤더 패턴 (모든 섹션 공통)
```tsx
// 반드시 이 순서대로: accent bar → overline → title → [subtitle]
<div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
<div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 6 }}>OVERLINE</div>
<div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b', marginBottom: 4 }}>섹션 타이틀</div>
<div style={{ fontSize: 13, color: '#52525b' }}>부제 (선택)</div>
```

> Courses.tsx에서는 `<SectionHeader>` 컴포넌트로 추출됨. 다른 페이지도 동일 컴포넌트 쓸 것.

### 페이지 헤더 패턴 (Courses, Blog 등 서브 페이지)
```tsx
<div style={{ background: '#fff', padding: '28px 0 0' }}>
  <div className="md:max-w-[1100px] md:mx-auto" style={{ padding: '0 20px' }}>
    <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
    <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 6 }}>LABEL</div>
    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b', marginBottom: 6 }}>페이지 타이틀</div>
    <div style={{ fontSize: 14, color: '#52525b', lineHeight: 1.65, paddingBottom: 24, borderBottom: '1px solid #e3e8ee' }}>
      설명
    </div>
  </div>
</div>
```

### 하단 CTA 패턴 (모든 페이지 공통)
```tsx
<div style={{ background: '#18181b', padding: '32px 20px 24px', textAlign: 'center' }}>
  <div className="md:max-w-[600px] md:mx-auto">
    <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>타이틀</div>
    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>부제</div>
    <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <button className="hover-btn" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 800, fontSize: 15 }}>
        메인 액션
      </button>
      <a href="tel:01028382391" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        전화 상담 010-2838-2391
      </a>
    </div>
    <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#52525b' }}>
      인코딩플러스 · 디미고 · 특성화고 입시 전문
    </div>
  </div>
</div>
```

---

## 6. 카드 컴포넌트

### 표준 카드
```tsx
style={{
  background: '#fff',
  border: '1px solid #e3e8ee',
  borderRadius: 14,          // 표준: 12~14px
  padding: 20,
  boxShadow: '0 1px 4px rgba(0,55,112,0.06)',
}}
className="hover-card"
```

### 강조 카드 (더 눈에 띄어야 할 때)
```
boxShadow: '0 2px 8px rgba(0,55,112,0.08)'
```

### 카드 내부 행 구분
```tsx
style={{ borderTop: '1px solid #f0f0f3' }}  // #e3e8ee 아님 — 내부 구분선은 더 흐리게
```

### 금지 사항
- 카드 위에 카드 그림자 중첩 금지
- borderRadius 20px 이상 금지 (슬라이더·모달 제외)
- 배경색으로 카드 구분 금지 (border + shadow 만 사용)

---

## 7. 버튼

### Primary 버튼
```tsx
className="hover-btn"
style={{
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 28px',
  fontWeight: 700,
  fontSize: 15,
}}
```

### Secondary 버튼
```tsx
style={{
  background: '#fff',
  border: '1px solid #e5e5ea',
  borderRadius: 10,
  padding: '12px 22px',
  fontWeight: 600,
  fontSize: 14,
  color: '#52525b',
}}
```

### 규칙
- 뷰포트당 Primary 버튼은 최대 2개 (섹션당 1개 권장)
- borderRadius: 9~11px 유지 (pill 999px 금지, 탭 버튼 예외)
- 비활성: `background: '#bfdbfe'`, `cursor: 'not-allowed'`

---

## 8. 호버·인터랙션

### CSS 클래스 (index.css에 정의됨)
```css
.hover-card    카드 hover: translateY(-2px) + shadow 강화
.hover-btn     버튼 hover: brightness(0.9) + translateY(-1px)
.nav-btn       네비 버튼 hover: bg #f0f9ff, color #1d4ed8
```

### 규칙
- 모든 클릭 가능한 카드 → `className="hover-card"` 필수
- 모든 Primary·Secondary 버튼 → `className="hover-btn"` 필수
- 네비 링크 버튼 → `className="nav-btn"` (active 상태 제외)
- transition은 CSS 클래스로만 — inline style에 transition 직접 쓰지 않는다

---

## 9. 네비게이션

### TopNav
```
모바일: height 56px, sticky top-0, backdrop-blur, borderBottom #e3e8ee
데스크탑: height 72px, sticky top-0, backdrop-blur, borderBottom #e3e8ee
```

### BottomNav (모바일 전용)
```
height 64px, fixed bottom, borderTop #e3e8ee
active: icon grayscale(0), label color #2563eb
inactive: icon grayscale(1) opacity(0.45), label color #a1a1aa
```

### Drawer
```
overlay: rgba(24,24,27,0.45)
panel: width 76% max 300px, borderLeft #e3e8ee
animation: drawerSlideIn (translateX), drawerFadeIn (opacity)
menu item borderBottom: #e3e8ee
```

---

## 10. 폼 입력

```tsx
// 텍스트 입력
style={{
  width: '100%',
  border: '1px solid #e5e5ea',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 15,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
}}
onFocus={e => { e.target.style.borderColor = '#2563eb' }}
onBlur={e => { e.target.style.borderColor = '#e5e5ea' }}

// 선택형 버튼 (radio 스타일)
border: selected ? '2px solid #2563eb' : '1px solid #e5e5ea'
background: selected ? '#f0f9ff' : '#fff'
color: selected ? '#1d4ed8' : '#52525b'
```

---

## 11. 슬라이더 (Hero Banner)

```tsx
// 컨테이너: 고정 높이 + overflow hidden으로 높이 변동 차단
<div style={{ position: 'relative', height: 264, borderRadius: 18, overflow: 'hidden' }}>

// 각 슬라이드: position absolute + opacity crossfade
style={{
  position: 'absolute', inset: 0,
  background: b.bg,
  padding: '24px 24px 56px',  // bottom 56: 화살표 공간
  opacity: i === slide ? 1 : 0,
  transition: 'opacity 0.45s ease',
  pointerEvents: i === slide ? 'auto' : 'none',
}}

// 화살표: 우하단 고정, 반투명 흰 원형
position: 'absolute', right: [44/10], bottom: 14, zIndex: 1
background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.08)'
borderRadius: '50%', width: 28, height: 28
```

---

## 12. 새 페이지/컴포넌트 체크리스트

새로 만들기 전 반드시 확인:

- [ ] 섹션 배경: `#fff` 단일 (회색 교대 금지)
- [ ] 섹션 구분: `borderTop: '1px solid #e3e8ee'` 만 사용
- [ ] 섹션 헤더: accent bar → overline → title 순서
- [ ] 카드: `border: '1px solid #e3e8ee'` + `boxShadow` + `className="hover-card"`
- [ ] Primary 버튼: `className="hover-btn"` 포함
- [ ] 네비 버튼: `className="nav-btn"` 포함 (active 제외)
- [ ] 색상: 이 문서 토큰 외 색상 사용 금지
- [ ] 하단 CTA: `#18181b` dark 패턴 (gray 카드 금지)
- [ ] 경계선: `#e3e8ee` (내부 행 구분만 `#f0f0f3`)
- [ ] 타이포: 헤드라인 fontWeight 800, letterSpacing -0.03em

---

## 13. 금지 사항 (Do NOT)

| 금지 | 대신 |
|------|------|
| 섹션 배경색 교대 (`#f6f9fc` 섹션) | 흰 배경 + `borderTop #e3e8ee` |
| pill 버튼 (`borderRadius: 999px`) | `borderRadius: 10px` |
| 그라디언트 배경 | 단색 배경만 |
| 두 번째 포인트 컬러 (Course 퍼플 제외) | Primary `#2563eb` 만 |
| 카드 그림자 중첩 | border + shadow 하나만 |
| `borderBottom` + `borderTop` 동시 사용 | `borderTop` 하나만 |
| inline style에 transition 직접 작성 | CSS 클래스 (hover-card, hover-btn) |
| fontWeight 400 헤드라인 | 최소 600, 헤드라인은 800 |
| 회색 하단 CTA 카드 | `#18181b` dark CTA 패턴 |
