---
status: accepted
---

# SPA 페이지뷰를 GA4 수동 전송으로 추적

이 앱은 React Router 기반 단일 페이지 앱이라, `index.html`의 gtag 스니펫만으로는 라우트 이동이 정확히 집계되지 않았다(경로는 잡히나 페이지 제목이 이전 페이지 기준으로 남고, `document.title`을 라우트별로 바꾸지 않아 모든 페이지가 홈 제목 하나로 뭉쳤다). 그래서 자동 페이지뷰를 끄고(`gtag('config', ..., { send_page_view: false })`), 라우터 안의 `RouteTracker` 컴포넌트가 경로 변경마다 정확한 경로·제목으로 `page_view`를 직접 전송하도록 했다.

## Considered Options

- **GA4 향상된 측정(Enhanced Measurement)의 자동 history 추적에 의존** — 코드 0줄이지만, 이벤트가 `pushState` 시점에 발생해 React가 제목을 갱신하기 전 값을 읽는다. 제목이 한 박자 밀리고, 페이지별 제목 구분이 사실상 불가능.
- **수동 `page_view` 전송 (채택)** — 경로·제목을 우리가 통제해 정확하고 누락이 없다. 대신 자동 추적과 중복되지 않도록 GA4 설정을 함께 꺼야 한다.

## Consequences

- **GA4 대시보드 설정 필요:** 관리 → 데이터 스트림 → 향상된 측정 → **"브라우저 기록 기반 페이지 변경" 옵션을 꺼야 한다.** 이 옵션은 코드로 제어할 수 없어(속성 설정), 켜둔 채로 두면 자동+수동 이벤트가 **중복 집계**된다.
- GA 측정 ID는 `src/lib/analytics.ts`의 `GA_MEASUREMENT_ID` 상수가 단일 출처. `index.html`의 gtag 스니펫 ID와 **두 곳이 일치**해야 한다.
- 새 사용자 라우트를 추가하면 `resolvePageTitle()`에 제목 매핑을 추가한다(빠뜨리면 기본값 "인코딩플러스"로 집계됨).
