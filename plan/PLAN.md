# Form PWA 개발 계획

## 프로젝트 개요

학원 관리자가 수강신청 폼과 문제 폼을 만들고, 학생/학부모가 하나의 웹사이트에서 접근해 작성·제출하면 관리자가 응답을 확인할 수 있는 PWA.

---

## 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | React 18 + TypeScript | Vite 번들러 |
| 스타일 | Tailwind CSS | 빠른 UI 구현 |
| DB | Firebase Firestore | 실시간 DB, 무료 플랜 |
| PWA | vite-plugin-pwa | 모바일 설치, 오프라인 지원 |
| 드래그앤드롭 | dnd-kit | 폼 빌더 질문 순서 변경 |
| 라우팅 | React Router v6 | 페이지 전환 |
| 호스팅 | Vercel | GitHub 연동 자동 배포 |

---

## 폴더 구조

```
form-pwa/
├── public/
│   └── icons/                  # PWA 아이콘
├── src/
│   ├── pages/
│   │   ├── Home.tsx            # 공개 메인 (활성 폼 목록)
│   │   ├── FormPage.tsx        # 폼 작성 페이지 (학생용)
│   │   ├── admin/
│   │   │   ├── AdminLogin.tsx  # 비밀번호 입력
│   │   │   ├── Dashboard.tsx   # 폼 목록 + 관리
│   │   │   ├── FormBuilder.tsx # 폼 제작/편집
│   │   │   └── Responses.tsx   # 응답 테이블
│   ├── components/
│   │   ├── builder/            # 폼 빌더 컴포넌트
│   │   ├── renderer/           # 폼 렌더러 컴포넌트
│   │   └── ui/                 # 공통 UI (버튼, 입력창 등)
│   ├── firebase/
│   │   └── config.ts           # Firebase 초기화
│   ├── hooks/                  # 커스텀 훅
│   ├── templates/              # 기본 템플릿 데이터
│   │   ├── enrollmentTemplate.ts
│   │   └── quizTemplate.ts
│   ├── types/
│   │   └── index.ts            # 타입 정의
│   ├── App.tsx
│   └── main.tsx
├── .env.local                  # 환경변수 (Firebase 키, Admin 비밀번호)
├── vite.config.ts
└── plan/
    └── PLAN.md
```

---

## Firebase 데이터 구조

```
forms/
  {formId}/
    title: string
    description: string
    type: "enrollment" | "quiz"
    isActive: boolean
    createdAt: timestamp
    sections: [
      {
        id: string
        title: string
        questions: [
          {
            id: string
            type: "short" | "long" | "radio" | "checkbox" | "ox" | "dropdown" | "date" | "number" | "info"
            label: string
            required: boolean
            options: string[]           # radio/checkbox/dropdown 선택지
            linkUrl: string             # info 전용 (외부 URL)
            linkText: string            # info 전용 (링크 표시 텍스트)
            correctAnswer: string | string[]  # quiz 전용 (정답, checkbox는 배열)
            points: number              # quiz 전용 (배점)
            branching: {               # 섹션 분기 조건
              [optionValue]: sectionIndex
            }
          }
        ]
      }
    ]

responses/
  {responseId}/
    formId: string
    respondentName: string
    submittedAt: timestamp
    answers: { [questionId]: any }
    score: number                       # quiz 전용
    totalScore: number                  # quiz 전용
```

---

## 개발 단계 (순서대로)

### Phase 1: 프로젝트 초기 설정
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] Tailwind CSS 설치 및 설정
- [ ] React Router 설치
- [ ] dnd-kit 설치
- [ ] vite-plugin-pwa 설치 및 설정
- [ ] 폴더 구조 생성
- [ ] Firebase SDK 설치

### Phase 2: Firebase 연동
- [ ] Firebase 프로젝트 생성 (관리자 직접 진행 — 가이드 제공)
- [ ] Firestore 데이터베이스 생성
- [ ] 환경변수(.env.local) 설정
- [ ] Firebase 초기화 코드 작성
- [ ] Firestore 보안 규칙 설정

### Phase 3: Admin 인증
- [ ] `/admin` 비밀번호 입력 페이지
- [ ] 로그인 상태 localStorage 저장
- [ ] 인증된 사용자만 Admin 라우트 접근 가능하도록 보호

### Phase 4: 폼 빌더 (Admin)
- [ ] 폼 생성 페이지 (제목, 설명, 유형 선택)
- [ ] 질문 추가/삭제/순서변경 (dnd-kit)
- [ ] 질문 유형별 편집 UI (단답형, 장문형, 객관식, 다중선택, O/X, 드롭다운, 날짜, 숫자, 안내문+링크)
- [ ] 객관식/드롭다운 선택지에 섹션 분기 조건 설정
- [ ] 문제 폼 전용: 정답 입력 필드
- [ ] 템플릿 선택 기능 (수강신청 템플릿, 문제 폼 템플릿, 처음부터 시작)
- [ ] Firestore에 폼 저장/수정/삭제

### Phase 5: 공개 폼 (학생용)
- [ ] 메인 페이지: 활성화된 폼 목록 표시
- [ ] 폼 작성 페이지: 이름 입력 → 질문 렌더링
- [ ] 섹션 분기 로직 (선택값에 따라 다음 섹션 이동)
- [ ] 제출 처리 → Firestore responses 저장
- [ ] 문제 폼: 제출 후 점수 표시
- [ ] 수강신청 폼: 제출 후 완료 메시지

### Phase 6: 응답 관리 (Admin)
- [ ] Admin 대시보드: 폼 목록 + 각 폼 응답 수 표시
- [ ] 폼별 응답 테이블: 이름, 제출일시, 각 질문별 답변
- [ ] 문제 폼: 점수 컬럼 추가

### Phase 7: PWA 마무리 + 배포
- [ ] 앱 아이콘, manifest.json 설정
- [ ] 오프라인 캐시 전략 설정
- [ ] GitHub 저장소 생성
- [ ] Vercel 연동 + 환경변수 등록
- [ ] 배포 테스트

---

## 환경변수 목록 (.env.local)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_PASSWORD=
```

---

## 기본 제공 템플릿

### 수강신청 템플릿
- 안내문 + 외부 URL (개인정보 처리방침 링크 — 관리자가 직접 URL 입력)
- 개인정보 동의 (객관식: 네/아니오)
- 수업 선택 (객관식 → 섹션 분기)
- 학생 이름 (단답형)
- 부모님 전화번호 (단답형)
- 학교 (단답형)
- 성별 (객관식)
- 생년월일 (단답형)
- 학생 전화번호 (단답형)
- 수업 요일 선택 (객관식)
- 비대면 수업시간 선택 (객관식)

### 문제 폼 템플릿 (질문 유형 전체 예시 포함)
- 안내문 (시험 안내 텍스트 + 외부 링크 선택)
- 단답형 문제 1개
- 장문형 문제 1개
- 객관식 문제 1개 (정답 1개 설정)
- 다중선택 문제 1개 (정답 여러 개 설정)
- O/X 문제 1개
- 드롭다운 문제 1개
- 숫자 입력 문제 1개
- 날짜 입력 문제 1개
※ 각 문제에 배점 설정 가능, 제출 후 총점 자동 계산

---

## 주요 고려사항

- 관리자 비밀번호는 환경변수로 관리 (코드에 직접 넣지 않음)
- Firestore 보안 규칙: 읽기는 공개, 쓰기(폼 생성/수정)는 서버 측 검증 불가이므로 Admin 기능은 클라이언트 단 비밀번호로만 보호 (1차 MVP 수준)
- 모바일 우선 반응형 디자인
- 폼 URL은 메인 페이지 하나로 통일 (별도 링크 불필요)
