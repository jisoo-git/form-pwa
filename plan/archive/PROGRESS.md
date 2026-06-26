# 인코딩 플러스 폼 PWA — 개발 가이드

> **요약 (3줄):**
> 1. **무엇을 쓰는 파일?** 기술 셋업 가이드 — 기술 스택, 폴더 구조, 라우팅, 타입 정의, Firebase 규칙, 인증 로직, 환경변수, 배포 방법이 다 있다.
> 2. **현재 상태?** 리디자인 이전 원본 구조 기록 — 폴더/라우트 구조는 REDESIGN.md 기준으로 바뀌었으나, 환경변수·Firebase 규칙·배포 방법은 여전히 유효.
> 3. **언제 참고?** Firebase·Vercel·환경변수 관련 질문이 생길 때. 폴더 구조·라우트는 REDESIGN.md가 더 최신.

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | React 18 + TypeScript (Vite) |
| 스타일 | Tailwind CSS v4 |
| DB | Firebase Firestore |
| 파일 스토리지 | Firebase Storage |
| PWA | vite-plugin-pwa |
| 드래그앤드롭 | dnd-kit |
| 라우팅 | React Router v6 |
| 호스팅 | Vercel (GitHub 연동 자동 배포) |

---

## 폴더 구조

```
src/
├── pages/
│   ├── Home.tsx                  # 랜딩 페이지 (학생용)
│   ├── FormPage.tsx              # 폼 응답 페이지 (학생용)
│   └── admin/
│       ├── AdminLogin.tsx        # 관리자 로그인
│       ├── Dashboard.tsx         # 폼 목록 + 관리
│       ├── FormBuilder.tsx       # 폼 제작/편집
│       └── Responses.tsx         # 응답 목록 + 상세
├── components/
│   ├── builder/
│   │   ├── QuestionEditor.tsx    # 질문 편집 UI
│   │   └── SortableQuestion.tsx  # dnd-kit 드래그 래퍼
│   └── ui/
│       ├── AdminLayout.tsx       # 관리자 공통 레이아웃
│       └── ProtectedRoute.tsx    # 인증 확인 라우트 가드
├── hooks/
│   ├── useAuth.ts                # 로그인/로그아웃/인증 확인
│   ├── useForms.ts               # Firestore forms CRUD
│   └── useUpload.ts              # Firebase Storage 파일 업로드
├── firebase/
│   └── config.ts                 # Firebase 초기화, db/storage export
├── templates/
│   ├── enrollmentTemplate.ts     # 수강신청 기본 템플릿
│   └── quizTemplate.ts           # 문제 폼 기본 템플릿
└── types/
    └── index.ts                  # 전체 타입 정의
```

---

## 라우팅 구조

```
/                          → Home.tsx (공개)
/form/:id                  → FormPage.tsx (공개)
/admin                     → AdminLogin.tsx
/admin/dashboard           → Dashboard.tsx (ProtectedRoute)
/admin/builder             → FormBuilder.tsx 신규 생성 (ProtectedRoute)
/admin/builder/:id         → FormBuilder.tsx 기존 폼 편집 (ProtectedRoute)
/admin/responses/:formId   → Responses.tsx (ProtectedRoute)
*                          → / 리다이렉트
```

`ProtectedRoute`는 `useAuth().isAuthenticated()` 로 확인 — false면 `/admin`으로 리다이렉트.

---

## 타입 정의 (`src/types/index.ts`)

```ts
QuestionType = 'short' | 'long' | 'radio' | 'checkbox' | 'ox' | 'omr'
             | 'dropdown' | 'date' | 'number' | 'info'

FormType = 'enrollment' | 'quiz'

Question {
  id, type, label, required
  options?        // radio / checkbox / dropdown / ox 선택지
  linkUrl?        // info 전용
  linkText?       // info 전용
  correctAnswer?  // quiz 전용 (string | string[])
  points?         // quiz 전용
  omrCount?       // omr 전용 (보기 개수)
  branching?      // { [optionValue]: sectionId | '__end__' }
}

Section { id, title, questions: Question[] }

Form { id?, title, description, type, isActive, createdAt?, sections: Section[] }

Response {
  id?, formId, respondentName, submittedAt?
  answers: Record<questionId, string | string[]>
  score?, totalScore?   // quiz 전용
}
```

---

## Firebase 데이터 구조

### Firestore 컬렉션

```
forms/{formId}         → Form 객체
responses/{responseId} → Response 객체
settings/landing       → { shortCourse: formId | null, regularCourse: formId | null }
```

### Firestore 보안 규칙 (`firestore.rules`)

```
forms     — read: true / write: true
responses — read: true / create: true / update,delete: false
settings  — read: true / write: true
```

> 현재 write 규칙이 모두 열려 있음. 관리자 인증은 클라이언트 단 비밀번호로만 보호 (MVP 수준).

### 주의: undefined 필드 제거

Firestore는 `undefined` 값을 저장할 수 없음. 저장 전 반드시 제거:
```ts
const cleaned = JSON.parse(JSON.stringify(data))
```
`useForms.ts`의 `createForm` / `updateForm`에서 이미 처리 중.

---

## 인증 구조 (`src/hooks/useAuth.ts`)

- 상태 저장: `localStorage` 키 `admin_auth = 'true'`
- `login(password)` → 검증 후 저장
- `isAuthenticated()` → localStorage 확인
- `logout()` → localStorage 제거

> **현재(발표용)**: 비밀번호 검증 없이 항상 true 반환. 실서비스 전 복원 필요.  
> 복원 시: `import.meta.env.VITE_ADMIN_PASSWORD` 와 비교하는 로직 재추가.

---

## 폼 빌더 핵심 로직

- 섹션 단위로 관리. 섹션 내 질문 순서는 dnd-kit `SortableContext` 로 변경.
- 선택지 분기(`branching`): `radio` / `dropdown` / `ox` 각 선택지에 다음 섹션 ID 또는 `'__end__'` 지정 가능.
- `'__end__'` 선택 시 FormPage에서 다음 버튼 비활성화 + 진행 불가 메시지 표시.

---

## 공개 폼 진행 로직 (`FormPage.tsx`)

1. `sectionHistory` 스택으로 이전 섹션 복귀 지원
2. 현재 섹션의 분기 질문 답변 확인 → 다음 섹션 ID 결정
3. 분기 없으면 sections 배열 순서대로 진행
4. 마지막 섹션 제출 시:
   - `quiz` 타입: 정답 비교 → `score` / `totalScore` 계산
   - Firestore `responses` 컬렉션에 저장
   - 1초 후 홈(`/`)으로 이동

---

## 환경변수

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_ADMIN_PASSWORD
```

로컬: `.env.local` / 배포: Vercel → Settings → Environment Variables  

> **현재(발표용)**: `src/firebase/config.ts`에 하드코딩됨. 실서비스 전 환경변수로 복원 필요.

---

## 배포

- **호스팅**: Vercel — `main` 브랜치 push 시 자동 배포
- **레포**: `jisoo-git/form-pwa` (private)
- **Firebase**: Authorized Domains에 Vercel 도메인 등록 완료
- **Firestore 규칙 배포**: `firebase deploy --only firestore`
- **Storage 규칙 배포**: `firebase deploy --only storage` (미실행)

---

## PWA 설정 (`vite.config.ts`)

현재 앱 이름이 기본값("학원 폼 관리")으로 되어 있음. 실서비스 전 수정 필요:
- `name`: "인코딩 플러스"
- `short_name`: "인코딩플러스"
- `description`: 실제 설명으로 변경
- 아이콘: `public/icons/icon-192.png`, `icon-512.png` 교체 (현재 파일 없음)
