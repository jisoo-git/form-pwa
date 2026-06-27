# 인코딩플러스 홍보 배너 이미지 생성 가이드

## 배너 구조 이해

현재 배너 컨테이너는 **고정 높이 264px, 가변 너비**입니다.
이미지 위에 어두운 그라데이션 오버레이가 자동으로 씌워지고, 텍스트(뱃지·제목·부제·버튼)는 **왼쪽 상단**에 고정됩니다.

```
┌─────────────────────────────────────────────┐
│ [뱃지]                    ←── 이미지 영역 ──→ │
│ [제목]          [왼쪽 30%]   [중앙~오른쪽 70%] │
│ [부제]          어둡게 비움   주요 피사체 배치  │
│ [버튼]                                       │
└─────────────────────────────────────────────┘
```

---

## 이미지 제작 필수 규칙

### 비율
- **3:1 와이드** 비율 권장 (예: 1200×400px, 1500×500px)
- 16:9도 가능하지만 상하가 크게 잘림 — 핵심을 세로 가운데 50% 안에 집중

### 구도
- **왼쪽 30%**: 어둡게 비워두기 (텍스트 오버레이 공간)
- **중앙~오른쪽 70%**: 주요 피사체 배치
- **상하 가운데 50%** 안에 핵심 내용 집중 (데스크탑 크롭 대응)

### 색조
- 전체적으로 **어두운 파란색·남색 계열** 톤 유지
- 밝은 배경, 흰 배경 금지 (오버레이 후 텍스트 가독성 불가)
- 빨강·주황·초록 계열 금지 (브랜드 컬러 #2563eb 파란색과 충돌)

### 금지 사항
- 이미지 안에 텍스트, 숫자, 로고, 간판 포함 금지
- 워터마크 금지

---

## 공통 후반부 (모든 프롬프트에 반드시 추가)

```
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast professional photography or digital art,
cinematic dark blue overlay compatible
```

---

## 주제별 프롬프트

### 1. 학생 집중 코딩 장면

```
A focused Korean middle school student typing on a laptop,
placed on the right side of frame,
dark modern classroom with blue ambient monitor lighting,
shallow depth of field, bokeh background,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast professional photography,
cinematic dark blue overlay compatible
```

### 2. IT·미래 기술 추상 배경

```
Futuristic dark blue digital circuit board with soft glowing light streams,
abstract technology concept, electric blue particles floating right side,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast digital art,
cinematic dark blue overlay compatible
```

### 3. 합격·성취 분위기

```
Korean middle school students celebrating success, smiling and looking upward,
positioned on right side of frame, blurred school building background,
dusk lighting with deep blue sky,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast professional photography,
cinematic dark blue overlay compatible
```

### 4. 코드·데이터 추상 배경

```
Abstract dark blue code matrix and data streams on deep navy background,
glowing cyan and blue light particles concentrated on right side,
depth of field blur on left,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
4K detailed digital art,
cinematic dark blue overlay compatible
```

### 5. 학원·수업 현장

```
A Korean educator teaching a small group of students in a modern dark classroom,
teacher gesturing toward a screen on the right side,
blue accent lighting, professional atmosphere,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast professional photography,
cinematic dark blue overlay compatible
```

### 6. 입시·시험 긴장감

```
Close up of hands writing on exam paper, pencil in motion,
dark wooden desk, dramatic side lighting from right,
shallow depth of field,
wide 3:1 landscape ratio,
subject positioned on center-right side,
left third of image is dark and empty for text overlay,
upper and lower edges are blurred or dark,
dark cinematic mood, deep blue and navy color tones,
no text, no logos, no numbers, no watermark,
high contrast professional photography,
cinematic dark blue overlay compatible
```

---

## 이미지 등록 방법

1. 생성한 이미지를 `public/banners/` 폴더에 저장
2. 파일명 공백 제거 필수 (예: `banner_coding.png`)
3. Firebase 관리자 → 홍보배너 → 배너 수정 → 이미지 URL 입력
   ```
   /banners/banner_coding.png
   ```
4. 이미지 URL 입력 시 기존 그라데이션(`bg`)은 무시되고 이미지가 우선 적용됨

---

## 배너 그라데이션 프리셋 (이미지 없을 때 대체)

| 이름 | CSS |
|------|-----|
| 진파랑 | `linear-gradient(135deg, #002B5C 0%, #2563eb 100%)` |
| 네이비 | `linear-gradient(135deg, #001233 0%, #003580 100%)` |
| 미드블루 | `linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)` |
| 딥블루 | `linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)` |
| 스카이 | `linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)` |
| 하늘 | `linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)` |
| 라이트블루 | `linear-gradient(135deg, #0ea5e9 0%, #93c5fd 100%)` |
| 다크 | `linear-gradient(135deg, #18181b 0%, #374151 100%)` |
