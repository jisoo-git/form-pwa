import type { Form } from '../types'

const id = () => crypto.randomUUID()

export function createEnrollmentTemplate(): Omit<Form, 'id' | 'createdAt'> {
  const sec1 = id(), sec2 = id(), sec3 = id()
  const q1 = id(), q2 = id(), q3 = id()

  return {
    title: '수강신청 폼',
    description: '',
    type: 'enrollment',
    isActive: false,
    sections: [
      {
        id: sec1,
        title: '2027학년도 수강 신청',
        questions: [
          {
            id: q1,
            type: 'info',
            label: '개인정보 처리방침 안내',
            required: false,
            linkText: '개인정보 처리방침 확인하기',
            linkUrl: '',
          },
          {
            id: q2,
            type: 'radio',
            label: '개인 정보 활용에 동의하시나요?',
            required: true,
            options: ['네', '아니오'],
          },
          {
            id: q3,
            type: 'radio',
            label: '원하시는 수업을 선택해 주세요.',
            required: true,
            options: ['입시 단기특강(특별전형+일반전형)', '일반전형 특강(일반전형만 진행)'],
            branching: {
              '입시 단기특강(특별전형+일반전형)': sec3,
              '일반전형 특강(일반전형만 진행)': sec2,
            },
          },
        ],
      },
      {
        id: sec2,
        title: '일반전형 특강 신청',
        questions: [
          { id: id(), type: 'short', label: '학생의 이름', required: true },
          { id: id(), type: 'short', label: '부모님 전화번호', required: true },
          { id: id(), type: 'short', label: '학교 (예: 양지중)', required: true },
          { id: id(), type: 'radio', label: '학생의 성별', required: true, options: ['남', '여'] },
          { id: id(), type: 'short', label: '학생의 생년월일 (6자리, 예: 080703)', required: true },
          { id: id(), type: 'short', label: '학생 전화번호 (예: 010-1234-5678)', required: true },
          {
            id: id(),
            type: 'radio',
            label: '수업요일 선택',
            required: true,
            options: ['토요일 오후 3시 ~ 오후 6시', '일요일 오후 3시 ~ 오후 6시'],
          },
          {
            id: id(),
            type: 'radio',
            label: '비대면 수업시간 선택',
            required: true,
            options: ['수요일 오후 10시 ~ 11시', '수요일 오후 11시 ~ 12시'],
          },
        ],
      },
      {
        id: sec3,
        title: '입시 단기특강 신청',
        questions: [
          { id: id(), type: 'short', label: '학생의 이름', required: true },
          { id: id(), type: 'short', label: '부모님 전화번호', required: true },
          { id: id(), type: 'short', label: '학교 (예: 양지중)', required: true },
          { id: id(), type: 'radio', label: '학생의 성별', required: true, options: ['남', '여'] },
          { id: id(), type: 'short', label: '학생의 생년월일 (6자리, 예: 080703)', required: true },
          { id: id(), type: 'short', label: '학생 전화번호 (예: 010-1234-5678)', required: true },
          {
            id: id(),
            type: 'radio',
            label: '수업요일 선택',
            required: true,
            options: ['토요일 오후 12시 ~ 오후 6시'],
          },
          {
            id: id(),
            type: 'radio',
            label: '비대면 수업시간 선택',
            required: true,
            options: ['수요일 오후 10시 ~ 11시', '수요일 오후 11시 ~ 12시'],
          },
        ],
      },
    ],
  }
}
