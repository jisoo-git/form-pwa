# 인코딩플러스 배너 이미지 제작 가이드

> 배너 슬라이더는 **이미지 전용**으로 운영합니다.
> 뱃지·제목·버튼 등 모든 텍스트를 이미지 안에 포함시켜 완성된 광고 이미지로 제작합니다.
> 웹사이트는 이미지를 그대로 표시하며 별도 오버레이가 없습니다.

---

## 이미지 규격

| 항목 | 값 |
|------|-----|
| **비율** | **16:9 필수** |
| **권장 크기** | 1920 × 1080 px |
| **최소 크기** | 1280 × 720 px |
| **포맷** | PNG (투명 없음) 또는 JPG |
| **파일 크기** | 1MB 이하 권장 |
| **파일명** | 공백·한글 없이 (예: `banner_dimigo_2027.png`) |

---

## 제작 도구 추천

### Canva (강력 추천)
한국어 폰트 지원 + 내장 AI 배경 생성 + 무료

1. [canva.com](https://www.canva.com) → **새 디자인** → **맞춤 크기** → `1920 × 1080`
2. 배경색 설정 후 AI 배경 이미지 삽입
3. 한국어 텍스트 직접 입력
4. **PNG 다운로드** → `public/banners/` 에 저장

### 기타 도구
- **Adobe Express** — Photoshop 계열, 한국어 폰트 우수
- **미리캔버스** — 한국어 특화 디자인 툴, 무료 템플릿 많음
- **Figma** — 개발자 친화적, 정밀 제어 가능

---

## 브랜드 디자인 가이드

배너가 웹사이트와 이질감 없으려면 아래 색상·폰트를 동일하게 사용하세요.

### 색상

| 용도 | 색상 코드 | 설명 |
|------|-----------|------|
| 배경 (기본) | `#001233` → `#002B5C` | 진파랑 그라데이션 (135도) |
| 배경 (네이비) | `#001233` → `#003580` | 더 짙은 네이비 |
| 배경 (다크) | `#18181b` → `#374151` | 거의 검정 |
| 배경 (미드블루) | `#0f4c75` → `#1b6ca8` | 중간 파랑 |
| 주요 텍스트 | `#FFFFFF` | 흰색 |
| 강조 텍스트 | `#93C5FD` | 연파랑 (사이트 primary-border-mid) |
| 포인트 컬러 | `#2563EB` | 브랜드 블루 (모든 CTA) |
| 보조 강조 | `#60A5FA` | 밝은 파랑 |

**금지 색상**: 빨강·주황·초록·보라·인디고 계열 — 브랜드 블루와 충돌

### 폰트 (Canva 기준)

| 용도 | 폰트 | 두께 |
|------|------|------|
| 메인 타이틀 | **Noto Sans KR** 또는 **Black Han Sans** | Black / ExtraBold |
| 부제목 | **Noto Sans KR** | Bold |
| 라벨·뱃지 | **Noto Sans KR** | SemiBold |

> 사이트 본래 폰트는 **Pretendard**이나 Canva에 없어서 Noto Sans KR로 대체. 굵기와 색상만 맞추면 이질감 거의 없음.

### 텍스트 레이아웃

```
┌─────────────────────────────────────┐
│                                     │
│  [뱃지/라벨]      왼쪽 정렬 기준    │
│                                     │
│  메인 타이틀                        │
│  (크고 굵게)                        │
│                                     │
│  부제목 또는 체크리스트             │
│                           [오브젝트] │
│                                     │
└─────────────────────────────────────┘
```

- 텍스트는 **왼쪽 정렬** 권장 (웹사이트 기존 배너와 일관성)
- 주요 오브젝트(학사모·책·아이콘 등)는 **오른쪽 하단** 배치
- 텍스트와 오브젝트가 겹치지 않게 공간 확보

---

## AI 배경 생성 프롬프트

> Canva AI 이미지 / Midjourney / DALL-E / Adobe Firefly에 입력
> **배경만 생성**하고 텍스트는 Canva에서 따로 추가할 것
> (AI는 한국어 텍스트를 정확하게 생성하지 못함)

### 공통 후반부 — 모든 프롬프트에 붙여넣기

```
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

---

### 프롬프트 1 — 졸업·합격 (학사모 + 책)

```
3D graduation cap placed on top of stacked navy blue hardcover books,
open notebook with pen resting on it, positioned on right side,
dramatic blue spotlight rays from upper left corner,
dark navy blue background gradient from #001233 to #002B5C,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

### 프롬프트 2 — IT·코딩·기술

```
Glowing blue circuit board with flowing data streams and light particles,
abstract digital technology concept, electric blue neon glow,
dark navy background, elements concentrated on right side,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

### 프롬프트 3 — 성공·미래·상승

```
3D upward rising arrow made of glowing blue light,
surrounded by floating blue particles and sparkles,
dark navy background, positioned on right side,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

### 프롬프트 4 — 트로피·1등·실적

```
3D golden trophy with blue glowing light around it,
star burst effect, confetti in blue and white tones,
dark navy blue background, positioned right side,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

### 프롬프트 5 — 체크·완료·확인

```
3D blue glowing checkmark icon with circular ring,
surrounded by blue light beams and particles,
dark navy background, positioned center-right,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

### 프롬프트 6 — 코딩·컴퓨터·화면

```
3D floating laptop with glowing blue screen, code lines visible as abstract light,
dark navy background, positioned right side of frame,
blue ambient lighting, professional scene,
no text, no korean characters, no letters, no numbers, no watermark,
dark navy blue background, deep blue tones,
professional advertising background, 3D render style,
16:9 wide landscape ratio, 1920x1080
```

---

## Canva 작업 순서 (단계별)

```
1. Canva → 새 디자인 → 맞춤 크기 → 1920 × 1080
2. 배경색: #001233 (또는 원하는 그라데이션)
3. 위 AI 프롬프트로 배경 오브젝트 이미지 생성 → 오른쪽에 배치
4. 텍스트 추가:
   ├── 뱃지/라벨: 작은 박스 + Noto Sans KR SemiBold 20px
   ├── 메인 타이틀: Black Han Sans 또는 Noto Sans KR Black 80~100px
   ├── 부제목: Noto Sans KR Bold 36~42px
   └── 강조 문구: 색상 #93C5FD (연파랑)
5. PNG 다운로드 (고품질)
6. 파일명 영문으로 저장 (예: banner_2027_special.png)
```

---

## 등록 방법

```
1. 완성 이미지 → public/banners/ 폴더에 저장
   예: public/banners/banner_dimigo_2027.png

2. Firebase 관리자 → 홍보배너 → 배너 수정
   이미지 URL 입력: /banners/banner_dimigo_2027.png

3. 배너 제목·부제·CTA 텍스트는 이미지에 이미 포함되어 있으므로
   Firebase에는 참고용으로만 입력 (웹에 표시 안 됨)
```

---

## 배너 색상 프리셋 참고

이미지 배경 선택 시 아래 그라데이션 중 하나를 기준으로 제작하면 슬라이더 전체가 일관성 있게 보입니다.

| 이름 | 왼쪽 색 | 오른쪽 색 | 분위기 |
|------|---------|---------|--------|
| 진파랑 | `#002B5C` | `#2563EB` | 밝고 강렬한 블루 |
| 네이비 | `#001233` | `#003580` | 깊고 신뢰감 |
| 미드블루 | `#0F4C75` | `#1B6CA8` | 부드러운 중간 톤 |
| 딥블루 | `#1E3A5F` | `#2563EB` | 고급스러운 다크 |
| 다크 | `#18181B` | `#374151` | 미니멀 블랙 |
