import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import AdminLayout from '../../components/ui/AdminLayout'
import SortableQuestion from '../../components/builder/SortableQuestion'
import { useForms } from '../../hooks/useForms'
import type { Form, Section, Question, QuestionType } from '../../types'

const newId = () => crypto.randomUUID()

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'short', label: '단답형' },
  { value: 'long', label: '장문형' },
  { value: 'radio', label: '객관식' },
  { value: 'checkbox', label: '다중선택' },
  { value: 'ox', label: 'O/X' },
  { value: 'dropdown', label: '드롭다운' },
  { value: 'date', label: '날짜' },
  { value: 'number', label: '숫자' },
  { value: 'info', label: 'PDF' },
]

export default function FormBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getForm, createForm, updateForm } = useForms()

  const [form, setForm] = useState<Omit<Form, 'id' | 'createdAt'> | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [addTypeOpen, setAddTypeOpen] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  // Esc 키 또는 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAddTypeOpen(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (id) {
      getForm(id).then(f => {
        if (f) setForm({ title: f.title, description: f.description, type: f.type, isActive: f.isActive, sections: f.sections })
      })
    } else {
      const formData = location.state?.formData
      if (formData) {
        setForm(formData)
      } else {
        setForm({
          title: '', description: '', type: 'enrollment', isActive: false,
          sections: [{ id: newId(), title: '섹션 1', questions: [] }],
        })
      }
    }
  }, [id])

  if (!form) return <div className="min-h-screen flex items-center justify-center text-gray-400">불러오는 중...</div>

  // ── Section helpers ────────────────────────────────────────────
  const addSection = () => {
    setForm(f => f && ({
      ...f,
      sections: [...f.sections, { id: newId(), title: `섹션 ${f.sections.length + 1}`, questions: [] }],
    }))
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setForm(f => f && ({
      ...f,
      sections: f.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    }))
  }

  const deleteSection = (sectionId: string) => {
    if (form.sections.length <= 1) return alert('섹션은 최소 1개 이상 있어야 합니다.')
    if (!confirm('이 섹션을 삭제할까요? 안의 질문도 모두 삭제됩니다.')) return
    setForm(f => f && ({ ...f, sections: f.sections.filter(s => s.id !== sectionId) }))
  }

  const moveSectionUp = (index: number) => {
    if (index === 0) return
    setForm(f => f && ({ ...f, sections: arrayMove(f.sections, index, index - 1) }))
  }

  const moveSectionDown = (index: number) => {
    if (!form || index === form.sections.length - 1) return
    setForm(f => f && ({ ...f, sections: arrayMove(f.sections, index, index + 1) }))
  }

  // ── Question helpers ───────────────────────────────────────────
  const addQuestion = (sectionId: string, type: QuestionType) => {
    const newQuestion: Question = {
      id: newId(), type, label: '', required: false,
      options: ['radio', 'checkbox', 'dropdown'].includes(type) ? ['선택지 1', '선택지 2'] : undefined,
    }
    setForm(f => f && ({
      ...f,
      sections: f.sections.map(s =>
        s.id === sectionId ? { ...s, questions: [...s.questions, newQuestion] } : s
      ),
    }))
    setExpandedId(newQuestion.id)
    setAddTypeOpen(null)
  }

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    setForm(f => f && ({
      ...f,
      sections: f.sections.map(s =>
        s.id === sectionId
          ? { ...s, questions: s.questions.map(q => q.id === questionId ? { ...q, ...updates } : q) }
          : s
      ),
    }))
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setForm(f => f && ({
      ...f,
      sections: f.sections.map(s =>
        s.id === sectionId ? { ...s, questions: s.questions.filter(q => q.id !== questionId) } : s
      ),
    }))
    if (expandedId === questionId) setExpandedId(null)
  }

  // ── DnD ───────────────────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setForm(f => {
      if (!f) return f
      const sections = f.sections.map(section => {
        const oldIndex = section.questions.findIndex(q => q.id === active.id)
        const newIndex = section.questions.findIndex(q => q.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return section
        return { ...section, questions: arrayMove(section.questions, oldIndex, newIndex) }
      })
      return { ...f, sections }
    })
  }

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) return alert('폼 제목을 입력해주세요.')
    setSaving(true)
    try {
      if (id) {
        await updateForm(id, form)
      } else {
        await createForm(form)
      }
      navigate('/admin/dashboard')
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout
      title={form.title || '새 폼'}
      backTo="/admin/dashboard"
      actions={
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <div
              onClick={() => setForm(f => f && ({ ...f, isActive: !f.isActive }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-green-400' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-xs text-gray-500">{form.isActive ? '활성' : '비활성'}</span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      }
    >
      {/* Form title & description */}
      <div className="bg-white rounded-xl border-l-4 border-blue-500 shadow-sm px-6 py-5 mb-4 space-y-4">
        <input
          value={form.title}
          onChange={e => setForm(f => f && ({ ...f, title: e.target.value }))}
          placeholder="폼 제목"
          className="w-full text-2xl font-bold text-gray-800 placeholder-gray-300 border-b-2 border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none pb-1 bg-transparent transition-colors"
        />
        <input
          value={form.description}
          onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))}
          placeholder="설명 (선택)"
          className="w-full text-sm text-gray-500 placeholder-gray-300 border-b border-gray-100 hover:border-gray-300 focus:border-blue-400 outline-none pb-1 bg-transparent transition-colors"
        />
      </div>

      {/* Sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {form.sections.map((section, sectionIndex) => (
            <div key={section.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
              {/* Section header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b-2 border-gray-200 rounded-t-xl">
                <input
                  value={section.title}
                  onChange={e => updateSection(section.id, { title: e.target.value })}
                  placeholder="섹션 제목"
                  className="flex-1 text-sm font-bold text-gray-700 bg-transparent border-none outline-none"
                />
                <div className="flex gap-1">
                  <button onClick={() => moveSectionUp(sectionIndex)} disabled={sectionIndex === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-sm px-1">↑</button>
                  <button onClick={() => moveSectionDown(sectionIndex)} disabled={sectionIndex === form.sections.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20 text-sm px-1">↓</button>
                  <button onClick={() => deleteSection(section.id)}
                    className="text-gray-200 hover:text-red-400 text-lg leading-none px-1">×</button>
                </div>
              </div>

              {/* Questions */}
              <div className="p-3 space-y-2">
                <SortableContext
                  items={section.questions.map(q => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {section.questions.length === 0 && (
                    <p className="text-sm text-gray-300 text-center py-4">질문을 추가해보세요</p>
                  )}
                  {section.questions.map(question => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      isExpanded={expandedId === question.id}
                      sectionId={section.id}
                      sections={form.sections}
                      onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
                      onChange={updates => updateQuestion(section.id, question.id, updates)}
                      onDelete={() => deleteQuestion(section.id, question.id)}
                    />
                  ))}
                </SortableContext>

                {/* Add question */}
                <div className="relative mt-2" ref={dropdownRef}>
                  <button
                    onClick={() => setAddTypeOpen(addTypeOpen === section.id ? null : section.id)}
                    className="text-sm text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    + 질문 추가
                  </button>
                  {addTypeOpen === section.id && (
                    <>
                      <div className="fixed inset-0 z-0" onClick={() => setAddTypeOpen(null)} />
                      <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-xl shadow-xl z-10 p-2 grid grid-cols-3 gap-1 w-64">
                      {TYPE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => addQuestion(section.id, value)}
                          className="text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-2 py-2 rounded-lg text-center transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      <button
        onClick={addSection}
        className="mt-4 w-full border-2 border-dashed border-gray-200 hover:border-blue-300 hover:text-blue-500 text-gray-400 text-sm font-medium py-3 rounded-xl transition-colors"
      >
        + 섹션 추가
      </button>
    </AdminLayout>
  )
}
