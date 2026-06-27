# 배너 이미지 제작 가이드 (ChatGPT / DALL-E 3)

**규격**: 1792 × 1024 (ChatGPT 와이드 포맷) · PNG · 파일명 영문

ChatGPT 요청 시 항상 마지막에 추가:
```
Generate in wide landscape format, 1792x1024
```

한국어 글자 틀리면: `"'[틀린글자]'를 '[올바른글자]'로 수정해서 다시 만들어줘"`

---

## 색상 옵션 (배너마다 교체)

프롬프트의 `Layout:` 줄 background 부분만 아래 중 하나로 바꾸면 됩니다.

| | 이름 | 교체 텍스트 |
|-|------|------------|
| **A** | 스카이블루 | `sky blue gradient, from #0369a1 to #0ea5e9 at 135 degrees, accent #0ea5e9` |
| **B** | 네이비+스카이 | `dark navy to sky blue gradient, from #002B5C to #0099D6 at 135 degrees, accent #0099D6` |
| **C** | 딥 네이비 | `very deep navy gradient, from #001233 to #003580 at 135 degrees, accent #003580` |
| **D** | 브랜드 블루 | `rich blue gradient, from #1e3a8a to #2563eb at 135 degrees, accent #2563eb` |
| **E** | 미드블루 | `ocean blue gradient, from #0f4c75 to #1b6ca8 at 135 degrees, accent #1b6ca8` |
| **F** | 딥블루+브라이트 | `deep navy to bright blue gradient, from #1e3a5f to #2563eb at 135 degrees, accent #2563eb` |
| **G** | 스카이+시안 | `vibrant blue to cyan gradient, from #1d4ed8 to #06b6d4 at 135 degrees, accent #06b6d4` |
| **H** | 다크 블랙 | `very dark charcoal gradient, from #18181b to #374151 at 135 degrees, accent #2563eb` |

---

## 배너 프롬프트

### 1 — 디미고 입시 특강
```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, dark navy to sky blue gradient, from #002B5C to #0099D6 at 135 degrees, accent #0099D6

Left side text (white, Korean):
- Small label: "디미고 합격률 1위" (light blue)
- Main title: "디미고 입시 특강" (very large, white, bold)
- Ribbon subtitle: "입시 단기특강 · 일반전형 특강" (on dark semi-transparent ribbon)
- Checkmark line: "특전과 일전을 모두 도전하여 합격률 상승" (white and light blue)

Right side: 3D graduation cap on stacked navy books with open notebook and pen, blue glow
Top left: dramatic blue light ray burst

Style: professional Korean advertising banner, cinematic blue tones, high quality 3D render
Generate in wide landscape format, 1792x1024
```

### 2 — 합격 실적
```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, very deep navy gradient, from #001233 to #003580 at 135 degrees, accent #003580

Left side text (white, Korean):
- Small label: "2026 디미고 입시 결과" (light blue)
- Main title: "디미고 37명 합격" (very large, white, extra bold)
- Subtitle: "2025년 35명 · 2024년 37명 · 2023년 35명" (white 80%)
- Accent: "9년 누적 212명 합격" (light blue glow)

Right side: 3D golden trophy with blue sparkles and star burst, blue and white confetti

Style: professional Korean advertising banner, achievement mood, premium dark navy
Generate in wide landscape format, 1792x1024
```

### 3 — 전형 안내
```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, ocean blue gradient, from #0f4c75 to #1b6ca8 at 135 degrees, accent #1b6ca8

Left side text (white, Korean):
- Small label: "특성화고 전 전형 대비" (light blue)
- Main title: "선린고 · 단소고" (large, white, bold)
- Title line 2: "다수 합격" (light blue accent)
- Subtitle: "특별전형부터 일반전형까지 완벽 대비합니다" (white 80%)

Right side: school buildings silhouette with light beams, floating academic symbols

Style: professional Korean educational banner, trustworthy tone
Generate in wide landscape format, 1792x1024
```

### 4 — 상담 문의
```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, very dark charcoal gradient, from #18181b to #374151 at 135 degrees, accent #2563eb

Left side text (white, Korean):
- Small label: "입시 상담 문의" (light blue)
- Main title: "010-2838-2391" (very large, white, monospace bold)
- Subtitle: "지금 바로 1:1 입시 상담을 신청하세요" (white 70%)
- Bottom: "카카오 채널 상담 가능" (yellow #FEE500)

Right side: 3D smartphone with glowing chat bubbles, blue ambient lighting

Style: professional Korean advertising banner, dark minimal, call to action
Generate in wide landscape format, 1792x1024
```

### 5 — 커스텀
```
Create a professional Korean educational academy banner image.

Layout: wide landscape 1792x1024, rich blue gradient, from #1e3a8a to #2563eb at 135 degrees, accent #2563eb

Left side text (white, Korean):
- Small label: [입력]
- Main title: [입력]
- Subtitle: [입력]

Right side: [오브젝트 입력 — 예: 3D calendar, trophy, laptop, books]

Style: professional Korean educational academy banner, electric blue tones, high quality 3D render
Generate in wide landscape format, 1792x1024
```

---

## 등록

```
public/banners/파일명.png 저장
→ Firebase 관리자 → 홍보배너 → 이미지 URL: /banners/파일명.png
```
