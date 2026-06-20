import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef } from 'react'
import type { Question, QuestionType, Section } from '../../types'
import { useUpload } from '../../hooks/useUpload'

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'short', label: '단답형' },
  { value: 'long', label: '장문형' },
  { value: 'radio', label: '객관식' },
  { value: 'checkbox', label: '다중선택' },
  { value: 'ox', label: 'O/X' },
  { value: 'omr', label: 'OMR' },
  { value: 'dropdown', label: '드롭다운' },
  { value: 'date', label: '날짜' },
  { value: 'number', label: '숫자' },
  { value: 'info', label: 'PDF' },
]

const circled = (n: number) => ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'][n - 1] ?? String(n)

function AnswerArea({ question, onChange, sections, currentSectionId }: {
  question: Question
  onChange: (u: Partial<Question>) => void
  sections: Section[]
  currentSectionId: string
}) {
  const { uploadPDF, uploading } = useUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const otherSections = sections.filter(s => s.id !== currentSectionId)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadPDF(file)
    onChange({ linkUrl: url })
    e.target.value = ''
  }

  const addOption = () =>
    onChange({ options: [...(question.options ?? []), `선택지 ${(question.options?.length ?? 0) + 1}`] })

  const updateOption = (i: number, val: string) => {
    const options = [...(question.options ?? [])]
    const old = options[i]
    options[i] = val
    if (question.branching?.[old] !== undefined) {
      const branching = { ...question.branching, [val]: question.branching[old] }
      delete branching[old]
      onChange({ options, branching })
    } else {
      onChange({ options })
    }
  }

  const removeOption = (i: number) => {
    const options = [...(question.options ?? [])]
    const removed = options.splice(i, 1)[0]
    const branching = { ...question.branching }
    delete branching[removed]
    onChange({ options, branching: Object.keys(branching).length ? branching : undefined })
  }

  const setBranch = (opt: string, secId: string) => {
    const branching = { ...(question.branching ?? {}) }
    if (!secId) delete branching[opt]
    else branching[opt] = secId
    onChange({ branching: Object.keys(branching).length ? branching : undefined })
  }

  switch (question.type) {
    case 'short':
      return <div className="mt-4 border-b-2 border-gray-300 text-sm text-gray-300 pb-1 w-1/2">단답형 답변</div>

    case 'long':
      return <div className="mt-4 border-b-2 border-gray-300 text-sm text-gray-300 pb-8 w-4/5">장문형 답변</div>

    case 'date':
      return (
        <div className="mt-4 flex items-center gap-2">
          <div className="border-b-2 border-gray-300 text-sm text-gray-300 pb-1 w-36">날짜 선택</div>
          <span>📅</span>
        </div>
      )

    case 'number':
      return <div className="mt-4 border-b-2 border-gray-300 text-sm text-gray-300 pb-1 w-1/3">숫자 입력</div>

    case 'ox':
      return (
        <div className="mt-4 space-y-2">
          {['O', 'X'].map(v => (
            <div key={v}>
              <div className="flex items-center gap-3 py-1 px-2 rounded-lg hover:bg-gray-50 cursor-default">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400 shrink-0" />
                <span className="text-sm text-gray-600">{v}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-9 mt-0.5">
                <span className="text-xs text-gray-300">↳</span>
                <select
                  value={question.branching?.[v] ?? ''}
                  onChange={e => setBranch(v, e.target.value)}
                  className="text-xs text-gray-400 hover:text-gray-600 border-none outline-none bg-transparent cursor-pointer transition-colors"
                >
                  <option value="">다음 섹션으로 이동</option>
                  {otherSections.map(s => (
                    <option key={s.id} value={s.id}>{s.title || '(제목 없음)'}</option>
                  ))}
                  <option value="__end__">⛔ 진행 불가</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )

    case 'info':
      return (
        <div className="mt-4 space-y-3">
          <div className="group">
            <label className="text-xs text-gray-400">URL <span className="text-gray-300">(없으면 일반 텍스트로 표시)</span></label>
            <div className="flex items-end gap-2 mt-1">
              <input
                value={question.linkUrl ?? ''}
                onChange={e => onChange({ linkUrl: e.target.value })}
                placeholder="https://... 또는 PDF 업로드"
                className="flex-1 border-b-2 border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none text-sm text-gray-500 pb-1 bg-transparent transition-colors"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="shrink-0 text-xs text-blue-500 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {uploading ? '업로드 중...' : 'PDF 업로드'}
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
            </div>
            {question.linkUrl && (
              <a href={question.linkUrl} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-1.5 text-xs text-blue-400 hover:text-blue-600 truncate max-w-full">
                🔗 {question.linkUrl}
              </a>
            )}
          </div>
        </div>
      )

    case 'omr': {
      const count = question.omrCount ?? 5
      return (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">선택지 수</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChange({ omrCount: Math.max(2, count - 1) })}
                className="w-7 h-7 rounded border border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >−</button>
              <span className="w-8 text-center text-sm font-medium text-gray-700">{count}</span>
              <button
                onClick={() => onChange({ omrCount: Math.min(10, count + 1) })}
                className="w-7 h-7 rounded border border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >+</button>
            </div>
            <span className="text-xs text-gray-400">개</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: count }, (_, i) => i + 1).map(n => (
              <div key={n}
                className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-bold text-gray-500">
                {circled(n)}
              </div>
            ))}
          </div>
        </div>
      )
    }

    case 'radio':
    case 'checkbox':
    case 'dropdown':
      return (
        <div className="mt-4 space-y-1">
          {(question.options ?? []).map((opt, i) => (
            <div key={i} className="group">
              <div className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                {question.type === 'checkbox'
                  ? <div className="w-4 h-4 rounded border-2 border-gray-400 shrink-0" />
                  : question.type === 'dropdown'
                  ? <span className="text-gray-400 text-sm w-4 shrink-0 text-center">{i + 1}.</span>
                  : <div className="w-4 h-4 rounded-full border-2 border-gray-400 shrink-0" />
                }
                <input
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none text-sm text-gray-700 pb-0.5 bg-transparent transition-colors"
                />
                <button
                  onClick={() => removeOption(i)}
                  className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors"
                >×</button>
              </div>
              {['radio', 'dropdown'].includes(question.type) && (
                <div className="flex items-center gap-1.5 ml-9 mt-0.5">
                  <span className="text-xs text-gray-300">↳</span>
                  <select
                    value={question.branching?.[opt] ?? ''}
                    onChange={e => setBranch(opt, e.target.value)}
                    className="text-xs text-gray-400 hover:text-gray-600 border-none outline-none bg-transparent cursor-pointer transition-colors"
                  >
                    <option value="">다음 섹션으로 이동</option>
                    {otherSections.map(s => (
                      <option key={s.id} value={s.id}>{s.title || '(제목 없음)'}</option>
                    ))}
                    <option value="__end__">⛔ 진행 불가</option>
                  </select>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm text-gray-400 hover:text-blue-500 hover:bg-gray-50 w-full text-left transition-colors"
          >
            {question.type === 'checkbox'
              ? <div className="w-4 h-4 rounded border-2 border-gray-300 shrink-0" />
              : question.type === 'dropdown'
              ? <span className="text-gray-300 text-sm w-4 shrink-0 text-center">{(question.options?.length ?? 0) + 1}.</span>
              : <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
            }
            선택지 추가
          </button>
        </div>
      )

    default:
      return null
  }
}

interface Props {
  question: Question
  isExpanded: boolean
  sectionId: string
  sections: Section[]
  onToggle: () => void
  onChange: (updates: Partial<Question>) => void
  onDelete: () => void
}

export default function SortableQuestion({ question, isExpanded, sectionId, sections, onToggle, onChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border-2 transition-all ${isExpanded ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}
    >
      {/* ── 접힌 상태 ─────────────────────────────── */}
      {!isExpanded && (
        <div className="flex items-center gap-2 px-3 py-3" onClick={onToggle}>
          <button {...attributes} {...listeners} onClick={e => e.stopPropagation()}
            className="text-gray-300 hover:text-gray-500 cursor-grab touch-none transition-colors">⠿</button>
          <p className="flex-1 text-sm text-gray-700 truncate">
            {question.label || <span className="text-gray-300 italic">질문 내용 없음</span>}
          </p>
          <span className="text-xs text-gray-400 shrink-0">{TYPE_OPTIONS.find(t => t.value === question.type)?.label}</span>
          {question.required && <span className="text-red-400 text-xs font-bold shrink-0">*</span>}
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="text-gray-300 hover:text-red-400 text-xl leading-none ml-1 transition-colors"
          >×</button>
        </div>
      )}

      {/* ── 펼친 상태 ─────────────────────────────── */}
      {isExpanded && (
        <div>
          {/* 상단: 드래그 + 삭제 */}
          <div className="flex items-center justify-between px-5 pt-4">
            <button {...attributes} {...listeners}
              className="text-gray-300 hover:text-gray-500 cursor-grab touch-none transition-colors">⠿</button>
            <button onClick={onDelete}
              className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors">×</button>
          </div>

          {/* 질문 입력 */}
          <div className="px-5 mt-3">
            <input
              value={question.label}
              onChange={e => onChange({ label: e.target.value })}
              placeholder={question.type === 'info' ? 'PDF 제목 (선택)' : '질문'}
              className="w-full text-base font-medium text-gray-800 border-b-2 border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none pb-2 bg-transparent transition-colors"
              autoFocus
            />
          </div>

          {/* 답변 영역 */}
          <div className="px-5">
            <AnswerArea question={question} onChange={onChange} sections={sections} currentSectionId={sectionId} />
          </div>

          {/* ── 구분선 1: 정답 + 배점 (항상 고정) ── */}
          {question.type !== 'info' && (
            <>
              <div className="border-t border-gray-100 mt-5 mx-5" />
              <div className={`px-5 py-3 ${question.type === 'long' ? 'flex flex-col gap-3' : 'flex items-center gap-6'}`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs text-gray-400 shrink-0">정답</span>
                  {question.type === 'omr' ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {Array.from({ length: question.omrCount ?? 5 }, (_, i) => i + 1).map(n => (
                        <button key={n}
                          onClick={() => onChange({ correctAnswer: question.correctAnswer === String(n) ? undefined : String(n) })}
                          className={`w-8 h-8 rounded-full border-2 text-sm font-bold transition-colors
                            ${question.correctAnswer === String(n)
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-500'}`}
                        >{circled(n)}</button>
                      ))}
                    </div>
                  ) : question.type === 'ox' ? (
                    <div className="flex gap-3">
                      {['O', 'X'].map(v => (
                        <label key={v} className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer hover:text-blue-500 transition-colors">
                          <input type="radio" name={`ox-${question.id}`}
                            checked={question.correctAnswer === v}
                            onChange={() => onChange({ correctAnswer: v })}
                            className="accent-blue-500 cursor-pointer" />
                          {v}
                        </label>
                      ))}
                      {question.correctAnswer && (
                        <button onClick={() => onChange({ correctAnswer: undefined })}
                          className="text-xs text-gray-300 hover:text-gray-500 transition-colors">지우기</button>
                      )}
                    </div>
                  ) : question.type === 'checkbox' ? (
                    <div className="flex flex-wrap gap-2">
                      {(question.options ?? []).map(opt => (
                        <label key={opt} className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer hover:text-blue-500 transition-colors">
                          <input type="checkbox"
                            checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(opt)}
                            onChange={e => {
                              const prev = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
                              const next = e.target.checked ? [...prev, opt] : prev.filter(v => v !== opt)
                              onChange({ correctAnswer: next.length ? next : undefined })
                            }}
                            className="accent-blue-500 cursor-pointer" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : ['radio', 'dropdown'].includes(question.type) ? (
                    <select
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="">없음</option>
                      {(question.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : question.type === 'long' ? (
                    <textarea
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      placeholder="모범 답안 입력 (없으면 비워두세요)"
                      rows={3}
                      className="flex-1 text-xs text-gray-600 border border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none rounded-lg p-2 bg-white transition-colors resize-none"
                    />
                  ) : question.type === 'date' ? (
                    <input
                      type="date"
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      className="text-xs text-gray-600 border border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none rounded-lg px-2 py-1 bg-white transition-colors cursor-pointer"
                    />
                  ) : question.type === 'number' ? (
                    <input
                      type="number"
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      placeholder="정답 숫자"
                      className="text-xs text-gray-600 border-b border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none bg-transparent transition-colors pb-0.5 w-24"
                    />
                  ) : (
                    <input
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      placeholder="없음"
                      className="flex-1 text-xs text-gray-600 border-b border-gray-200 hover:border-gray-400 focus:border-blue-500 outline-none bg-transparent transition-colors pb-0.5"
                    />
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-gray-400">배점</span>
                  <input
                    type="number" min={0}
                    value={question.points ?? ''}
                    onChange={e => onChange({ points: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="—"
                    className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 w-14 text-center hover:border-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white"
                  />
                  <span className="text-xs text-gray-400">점</span>
                </div>
              </div>
            </>
          )}

          {/* ── 구분선 2: 유형 + 필수 (항상 고정) ── */}
          <div className="border-t border-gray-100 mx-5" />
          <div className="px-5 py-3 flex items-center justify-between">
            <select
              value={question.type}
              onChange={e => onChange({
                type: e.target.value as QuestionType,
                options: [],
                correctAnswer: undefined,
                branching: undefined,
              })}
              className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {question.type !== 'info' && (
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">필수</span>
                <div
                  onClick={() => onChange({ required: !question.required })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${question.required ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${question.required ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
