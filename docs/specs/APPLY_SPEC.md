# 수강신청(Apply) 렌더링 스펙

`Apply.tsx`가 폼을 렌더하는 방식. 용어는 [CONTEXT.md](../../CONTEXT.md), 데이터 구조는 [DATA-MODEL.md](../DATA-MODEL.md) 참조.

## 렌더 방식 결정

`?type=` URL 파라미터와 Firestore `forms.type` 필드로 결정한다.

| 조건 | `isEnrollment` | 렌더 방식 |
|------|---------------|----------|
| `?type=` 없음 + `isActive` 폼의 type = enrollment | `true` | 3-step 하드코딩 |
| `?type=enrollment` | `true` | 동일 |
| 그 외 — enrollment이 아닌 활성/지정 폼 (예: **설명회 신청** 폼) | `false` | 섹션별 step (1섹션 = 1스텝) |

- `?type=` 있으면 `where('type', '==', formType)`, 없으면 `where('isActive', '==', true)`로 폼을 로드한다.
- **설명회 신청**은 enrollment이 아닌 별도 활성 Form이라 후자(섹션별 step) 경로를 탄다. 제출은 일반 **Submission**으로 `submissions`에 쌓인다.
- `forms.type` 값은 `'enrollment' | 'quiz'` 뿐이다. 과거 문서의 `seminar` type은 실재하지 않는 잔재였다.

## enrollment 3-step 규칙

- **Step 1**: 개인정보 동의(하드코딩) + 수업 선택(`COURSE_OPTIONS`) + "신청 확인" 섹션의 info 질문
- **Step 2**: "유의사항" 섹션 info 질문 + 확인 체크박스
- **Step 3**: 선택한 수업명과 일치하는 섹션의 질문들
- 섹션 제목 매칭 키워드는 Apply.tsx와 **정확히** 일치해야 한다: `유의사항` / `입시 단기특강` / `일반전형 특강`

## 연동

관리자 폼 편집(`FormBuilder.tsx`)·제출 현황(`AdminSubmissions.tsx`)과 데이터를 공유한다 → [DEPENDENCY-MAP.md](../DEPENDENCY-MAP.md).
