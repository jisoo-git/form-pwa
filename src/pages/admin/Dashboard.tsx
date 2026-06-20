import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import AdminLayout from '../../components/ui/AdminLayout'
import { useForms } from '../../hooks/useForms'
import { createEnrollmentTemplate } from '../../templates/enrollmentTemplate'
import { createQuizTemplate } from '../../templates/quizTemplate'
import type { Form } from '../../types'

type TemplateKey = 'enrollment' | 'quiz' | 'blank'
type LandingLinks = { course1: string; course2: string }

export default function Dashboard() {
  const { forms, loading, deleteForm, updateForm } = useForms()
  const [showModal, setShowModal] = useState(false)
  const [landingLinks, setLandingLinks] = useState<LandingLinks>({ course1: '', course2: '' })
  const [showLanding, setShowLanding] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getDoc(doc(db, 'settings', 'landing')).then(snap => {
      if (snap.exists()) setLandingLinks(snap.data() as LandingLinks)
    })
  }, [])

  const saveLandingLinks = async () => {
    await setDoc(doc(db, 'settings', 'landing'), landingLinks)
    alert('저장됐어요!')
    setShowLanding(false)
  }

  const handleTemplateSelect = (key: TemplateKey) => {
    let template: Omit<Form, 'id' | 'createdAt'>
    if (key === 'enrollment') template = createEnrollmentTemplate()
    else if (key === 'quiz') template = createQuizTemplate()
    else template = { title: '', description: '', type: 'enrollment', isActive: false, sections: [{ id: crypto.randomUUID(), title: '섹션 1', questions: [] }] }
    setShowModal(false)
    navigate('/admin/builder', { state: { formData: template } })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 폼을 삭제할까요?')) return
    await deleteForm(id)
  }

  const handleToggleActive = async (form: Form) => {
    try {
      await updateForm(form.id!, { isActive: !form.isActive })
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message)
    }
  }

  return (
    <AdminLayout title="폼 관리">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600 font-medium">폼 {forms.length}개</p>
          <button
            onClick={() => setShowLanding(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold border border-indigo-200 hover:border-indigo-400 rounded-lg px-2.5 py-1 transition-colors"
          >
            🔗 홈 연결 설정
          </button>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + 새 폼 만들기
        </button>
      </div>

      {/* 폼 목록 */}
      {loading ? (
        <p className="text-center text-gray-400 py-16">불러오는 중...</p>
      ) : forms.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-3">📋</p>
          <p>아직 만든 폼이 없어요.</p>
          <p className="text-sm mt-1">"새 폼 만들기"를 눌러 시작해보세요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map(form => (
            <div key={form.id} className="bg-white rounded-xl border border-gray-300 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{form.title || '제목 없음'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {form.type === 'enrollment' ? '수강신청' : '문제폼'} · 섹션 {form.sections?.length ?? 0}개
                  </p>
                  {(landingLinks.course1 === form.id || landingLinks.course2 === form.id) && (
                    <p className="text-xs text-indigo-500 font-semibold mt-0.5">
                      🔗 홈 {landingLinks.course1 === form.id ? '단기특강' : '일반전형'} 버튼 연결됨
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleToggleActive(form)}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                    form.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {form.isActive ? '활성' : '비활성'}
                </button>
              </div>
              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200 flex-wrap">
                <button
                  onClick={() => navigate(`/admin/responses/${form.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >응답 보기</button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/form/${form.id}`
                    navigator.clipboard.writeText(url).then(() => alert('링크 복사!\n' + url))
                  }}
                  className="text-xs text-green-600 hover:text-green-800 font-semibold"
                >링크 복사</button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => navigate(`/admin/builder/${form.id}`)}
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >편집</button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleDelete(form.id!)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 홈 연결 설정 모달 */}
      {showLanding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-1">홈 신청 버튼 연결</h2>
            <p className="text-sm text-gray-500 mb-5">각 과정 버튼에 연결할 폼을 선택하세요.</p>
            <div className="space-y-4">
              {[
                { key: 'course1' as keyof LandingLinks, label: '단기특강 버튼' },
                { key: 'course2' as keyof LandingLinks, label: '일반전형 버튼' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <p className="text-xs font-bold text-gray-600 mb-1.5">{label}</p>
                  <select
                    value={landingLinks[key]}
                    onChange={e => setLandingLinks(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-blue-500"
                  >
                    <option value="">— 연결 안 함 (신청 준비 중) —</option>
                    {forms.map(f => (
                      <option key={f.id} value={f.id}>{f.title || '제목 없음'}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowLanding(false)}
                className="flex-1 py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl transition-colors"
              >취소</button>
              <button
                onClick={saveLandingLinks}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 새 폼 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-1">어떤 폼을 만들까요?</h2>
            <p className="text-sm text-gray-400 mb-5">템플릿을 선택하면 기본 질문이 채워져요.</p>
            <div className="flex flex-col gap-3">
              {[
                { key: 'enrollment' as TemplateKey, title: '수강신청 템플릿', desc: '이름, 연락처, 수업 선택 등 기본 항목 포함' },
                { key: 'quiz' as TemplateKey, title: '문제 폼 템플릿', desc: '객관식, 단답형, O/X 등 다양한 유형 포함' },
                { key: 'blank' as TemplateKey, title: '처음부터 시작', desc: '빈 폼에서 직접 구성하기' },
              ].map(({ key, title, desc }) => (
                <button key={key} onClick={() => handleTemplateSelect(key)}
                  className="text-left border border-gray-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-4 transition-colors">
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(false)}
              className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 py-1">취소</button>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
