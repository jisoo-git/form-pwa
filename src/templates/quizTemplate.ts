import type { Form } from '../types'

const id = () => crypto.randomUUID()

export function createQuizTemplate(): Omit<Form, 'id' | 'createdAt'> {
  return {
    title: '문제 폼',
    description: '',
    type: 'quiz',
    isActive: false,
    sections: [
      {
        id: id(),
        title: '시험 문제',
        questions: [
          {
            id: id(),
            type: 'info',
            label: '시험 안내',
            required: false,
            linkText: '참고 자료 링크 (선택)',
            linkUrl: '',
          },
          {
            id: id(),
            type: 'short',
            label: '단답형 문제: 정답을 간단히 입력하세요.',
            required: true,
            correctAnswer: '정답 예시',
            points: 10,
          },
          {
            id: id(),
            type: 'long',
            label: '서술형 문제: 자세히 서술하세요.',
            required: true,
            points: 20,
          },
          {
            id: id(),
            type: 'radio',
            label: '객관식 문제: 올바른 답을 하나 고르세요.',
            required: true,
            options: ['선택지 1', '선택지 2', '선택지 3', '선택지 4'],
            correctAnswer: '선택지 1',
            points: 10,
          },
          {
            id: id(),
            type: 'checkbox',
            label: '다중선택 문제: 맞는 답을 모두 고르세요.',
            required: true,
            options: ['선택지 A', '선택지 B', '선택지 C', '선택지 D'],
            correctAnswer: ['선택지 A', '선택지 C'],
            points: 15,
          },
          {
            id: id(),
            type: 'ox',
            label: 'O/X 문제: 맞으면 O, 틀리면 X를 선택하세요.',
            required: true,
            correctAnswer: 'O',
            points: 5,
          },
          {
            id: id(),
            type: 'dropdown',
            label: '드롭다운 문제: 목록에서 정답을 선택하세요.',
            required: true,
            options: ['보기 1', '보기 2', '보기 3'],
            correctAnswer: '보기 2',
            points: 10,
          },
          {
            id: id(),
            type: 'number',
            label: '숫자 입력 문제: 정답 숫자를 입력하세요.',
            required: true,
            correctAnswer: '42',
            points: 10,
          },
          {
            id: id(),
            type: 'date',
            label: '날짜 입력 문제: 해당하는 날짜를 입력하세요.',
            required: true,
            points: 10,
          },
        ],
      },
    ],
  }
}
