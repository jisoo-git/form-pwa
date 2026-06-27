# 인코딩플러스 배너 이미지 제작 가이드 (ChatGPT / DALL-E 3)

> 배너 슬라이더는 **이미지 전용**입니다.
> ChatGPT(DALL-E 3)로 텍스트·디자인이 모두 포함된 완성 배너를 생성합니다.

---

## 이미지 규격

| 항목 | 값 |
|------|-----|
| **비율** | 16:9 (근사) |
| **생성 크기** | **1792 × 1024** (ChatGPT 와이드 포맷) |
| **포맷** | PNG |
| **파일명** | 영문, 공백 없이 (예: `banner_dimigo_2027.png`) |

ChatGPT에 요청 시 반드시 명시:
```
Generate in wide landscape format, 1792x1024
```

---

## 한국어 텍스트 팁

DALL-E 3는 한국어를 넣을 수 있지만 **간혹 글자가 틀립니다**.
- 짧고 명확한 단어일수록 정확도 높음
- 틀리면 ChatGPT에 `"한국어 텍스트 '[틀린 글자]'를 '[올바른 글자]'로 수정해서 다시 만들어줘"` 요청
- 텍스트가 중요한 배너는 2~3회 재생성해서 가장 정확한 것 선택

---

## 색상 옵션 — 배너마다 바꿔서 다양하게

프롬프트의 `Layout: ...background` 부분만 아래 옵션 중 하나로 교체하면 됩니다.

### 옵션 A — 스카이블루 (theme-original)
```
sky blue gradient background, from #0369a1 to #0ea5e9 at 135 degrees,
accent color #0ea5e9, light blue glow effects
```
> 밝고 청량한 블루. 가장 활기찬 느낌.

### 옵션 B — 네이비 + 스카이 (theme-current / 현재 브랜드)
```
dark navy to sky blue gradient background, from #002B5C to #0099D6 at 135 degrees,
accent color #0099D6, electric blue highlights
```
> 현재 사이트 메인 컬러. 신뢰감 + 활기 균형.

### 옵션 C — 딥 네이비 (theme-deepnavy)
```
very deep navy blue gradient background, from #001233 to #003580 at 135 degrees,
accent color #003580, subtle blue glow, premium dark tone
```
> 가장 어둡고 묵직한 고급스러운 느낌.

### 옵션 D — 브랜드 블루 (theme-blue600 / 현재 UI 기준)
```
rich blue gradient background, from #1e3a8a to #2563eb at 135 degrees,
accent color #2563eb, bright electric blue highlights
```
> 현재 웹사이트 버튼·CTA와 동일한 파랑. 일관성 최고.

### 옵션 E — 미드블루
```
ocean blue gradient background, from #0f4c75 to #1b6ca8 at 135 degrees,
accent color #1b6ca8, calm professional blue
```
> 차분하고 신뢰감 있는 중간 톤.

### 옵션 F — 딥블루 + 브라이트
```
deep navy to bright blue gradient background, from #1e3a5f to #2563eb at 135 degrees,
accent color #2563eb, dramatic blue contrast
```
> 어두운 베이스에 밝은 파랑이 대비. 역동적인 느낌.

### 옵션 G — 스카이 + 시안
```
vibrant blue to cyan gradient background, from #1d4ed8 to #06b6d4 at 135 degrees,
accent color #06b6d4, teal and cyan highlights
```
> 가장 밝고 미래지향적인 느낌. 튀는 배너에 적합.

### 옵션 H — 다크 (블랙)
```
very dark charcoal gradient background, from #18181b to #374151 at 135 degrees,
accent color #2563eb, minimal dark tone with blue accents
```
> 미니멀하고 고급스러운 거의 검정 배경.

---

## 완성 배너 프롬프트 (복붙 사용)

> **배경 색상 바꾸는 법**: `Layout:` 줄의 `background` 부분을 위 **색상 옵션 A~H** 중 하나로 교체

---

### 배너 1 — 디미고 입시 특강

```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, dark navy to sky blue gradient background, from #002B5C to #0099D6 at 135 degrees, accent color #0099D6

Left side text (white, Korean):
- Top small label: "디미고 합격률 1위" (small, light blue)
- Large main title: "디미고 입시 특강" (very large, white, bold)
- Subtitle banner strip: "입시 단기특강 · 일반전형 특강" (medium, on a semi-transparent dark ribbon)
- Bottom line with checkmark icon: "특전과 일전을 모두 도전하여 합격률 상승" (white and light blue)

Right side: 3D graduation cap on stacked navy blue books with open notebook and pen, blue glow lighting

Top left: dramatic blue light ray burst effect

Style: professional Korean advertising banner, cinematic blue tones, high quality 3D render elements
Generate in wide landscape format, 1792x1024
```

---

### 배너 2 — 합격 실적

```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, very deep navy blue gradient background, from #001233 to #003580 at 135 degrees, accent color #003580

Left side text (white, Korean):
- Top small label: "2026 디미고 입시 결과" (small, light blue, bold)
- Large main title: "디미고 37명 합격" (very large, white, extra bold)
- Subtitle: "2025년 35명 · 2024년 37명 · 2023년 35명" (medium, white 80%)
- Bottom accent: "9년 누적 212명 합격" (light blue glow text)

Right side: 3D golden trophy with blue sparkles and star burst effect, confetti in blue and white tones

Style: professional Korean advertising banner, achievement mood, premium dark navy tones, high quality
Generate in wide landscape format, 1792x1024
```

---

### 배너 3 — 전형 안내

```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, ocean blue gradient background, from #0f4c75 to #1b6ca8 at 135 degrees, accent color #1b6ca8

Left side text (white, Korean):
- Top small label: "특성화고 전 전형 대비" (small, light blue)
- Large main title: "선린고 · 단소고" (large, white, bold)
- Second title line: "다수 합격" (same large size, light blue accent)
- Subtitle: "특별전형부터 일반전형까지 완벽 대비합니다" (medium, white 80%)

Right side: Multiple school buildings silhouette with light beams, academic symbols floating

Style: professional Korean educational banner, trustworthy academic tone, blue tones
Generate in wide landscape format, 1792x1024
```

---

### 배너 4 — 상담 문의

```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, very dark charcoal gradient background, from #18181b to #374151 at 135 degrees, accent color #2563eb

Left side text (white, Korean):
- Top small label: "입시 상담 문의" (small, light blue)
- Large main title: "010-2838-2391" (very large, white, monospace bold style)
- Subtitle: "지금 바로 1:1 입시 상담을 신청하세요" (medium, white 70%)
- Bottom: "카카오 채널 상담 가능" (yellow #FEE500 accent text)

Right side: 3D smartphone with glowing screen showing chat bubbles, blue ambient lighting

Style: professional Korean advertising banner, clean minimal dark tone, call to action mood
Generate in wide landscape format, 1792x1024
```

---

### 배너 5 — 커스텀 (자유 입력)

```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, rich blue gradient background, from #1e3a8a to #2563eb at 135 degrees, accent color #2563eb

Left side text (white, Korean):
- Top small label: [라벨 입력]
- Large main title: [메인 타이틀 입력]
- Subtitle: [부제목 입력]

Right side: [원하는 오브젝트 입력 — 예: 3D calendar, trophy, laptop, books]

Style: professional Korean educational academy advertising banner, electric blue tones, high quality 3D render
Generate in wide landscape format, 1792x1024
```

---

## 배너 색상 조합 추천 (4장 세트)

슬라이더에 4장 배너를 올릴 때 아래 조합으로 하면 비슷하면서도 다양합니다.

| 배너 | 색상 옵션 | 느낌 |
|------|----------|------|
| 배너 1 | 옵션 B (네이비+스카이) | 메인, 가장 브랜드다운 |
| 배너 2 | 옵션 C (딥 네이비) | 무게감 있는 실적 강조 |
| 배너 3 | 옵션 E (미드블루) | 차분한 정보 전달 |
| 배너 4 | 옵션 H (다크) | 대비 강한 CTA |

---

## ChatGPT 요청 방법

1. ChatGPT → 대화창에 위 프롬프트 복붙
2. 이미지 생성 후 한국어 텍스트 확인
3. 틀린 글자 있으면: `"한국어 텍스트 '[틀린 글자]'를 '[올바른 글자]'로 수정해서 다시 만들어줘"`
4. 만족스러우면 이미지 다운로드 (우클릭 → 이미지 저장)

---

## 등록 방법

```
1. 다운로드 이미지 → public/banners/ 폴더에 저장
   예: public/banners/banner_dimigo_2027.png

2. Firebase 관리자 → 홍보배너 → 배너 수정
   이미지 URL: /banners/banner_dimigo_2027.png

3. 텍스트 필드는 관리용으로만 입력 (웹에 표시 안 됨)
```
