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

// ── 공통 inline style helpers ────────────────────────────────
const inputBase: React.CSSProperties = {
  width: '100%', border: '1px solid #c8d0dc', borderRadius: 8,
  padding: '9px 12px', fontSize: 14, color: '#18181b',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const underlineInput: React.CSSProperties = {
  width: '100%', border: 'none', borderBottom: '2px solid #c8d0dc',
  outline: 'none', paddingBottom: 8, fontSize: 15, fontWeight: 600,
  color: '#18181b', background: 'transparent', boxSizing: 'border-box',
  fontFamily: 'inherit',
}

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
      return <div style={{ marginTop: 12, borderBottom: '2px solid #c8d0dc', fontSize: 13, color: '#d4d4d8', paddingBottom: 4, width: '50%' }}>단답형 답변</div>

    case 'long':
      return <div style={{ marginTop: 12, borderBottom: '2px solid #c8d0dc', fontSize: 13, color: '#d4d4d8', paddingBottom: 32, width: '80%' }}>장문형 답변</div>

    case 'date':
      return (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ borderBottom: '2px solid #c8d0dc', fontSize: 13, color: '#d4d4d8', paddingBottom: 4, width: 120 }}>날짜 선택</div>
          <span>📅</span>
        </div>
      )

    case 'number':
      return <div style={{ marginTop: 12, borderBottom: '2px solid #c8d0dc', fontSize: 13, color: '#d4d4d8', paddingBottom: 4, width: '33%' }}>숫자 입력</div>

    case 'ox':
      return (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['O', 'X'].map(v => (
            <div key={v}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #d4d4d8', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#52525b' }}>{v}</span>
              </div>
              {otherSections.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 34, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: '#d4d4d8' }}>↳</span>
                  <select
                    value={question.branching?.[v] ?? ''}
                    onChange={e => setBranch(v, e.target.value)}
                    style={{ fontSize: 11, color: '#8c959f', border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer' }}
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
        </div>
      )

    case 'info':
      return (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>URL <span style={{ color: '#d4d4d8' }}>(없으면 일반 텍스트로 표시)</span></div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={question.linkUrl ?? ''}
                onChange={e => onChange({ linkUrl: e.target.value })}
                placeholder="https://... 또는 PDF 업로드"
                style={{ ...inputBase, flex: 1 }}
                onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  flexShrink: 0, fontSize: 12, fontWeight: 600,
                  color: '#1d4ed8', border: '1px solid #93c5fd',
                  borderRadius: 8, padding: '8px 12px', background: '#dbeafe',
                  cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading ? '업로드 중...' : 'PDF 업로드'}
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
            {question.linkUrl && (
              <a href={question.linkUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: 6, fontSize: 11, color: '#2563eb', textDecoration: 'none', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🔗 {question.linkUrl}
              </a>
            )}
          </div>
        </div>
      )

    case 'omr': {
      const count = question.omrCount ?? 5
      return (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: '#8c959f' }}>선택지 수</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => onChange({ omrCount: Math.max(2, count - 1) })}
                style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #c8d0dc', background: '#fff', color: '#52525b', fontSize: 13, cursor: 'pointer' }}
              >−</button>
              <span style={{ width: 32, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#18181b' }}>{count}</span>
              <button
                onClick={() => onChange({ omrCount: Math.min(10, count + 1) })}
                style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #c8d0dc', background: '#fff', color: '#52525b', fontSize: 13, cursor: 'pointer' }}
              >+</button>
            </div>
            <span style={{ fontSize: 12, color: '#8c959f' }}>개</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Array.from({ length: count }, (_, i) => i + 1).map(n => (
              <div key={n} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #d4d4d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#71717a' }}>
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
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(question.options ?? []).map((opt, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 8 }}>
                {question.type === 'checkbox'
                  ? <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #d4d4d8', flexShrink: 0 }} />
                  : question.type === 'dropdown'
                  ? <span style={{ fontSize: 13, color: '#8c959f', width: 18, flexShrink: 0, textAlign: 'center' }}>{i + 1}.</span>
                  : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #d4d4d8', flexShrink: 0 }} />
                }
                <input
                  value={opt}
                  onChange={e => updateOption(i, e.target.value)}
                  style={{
                    flex: 1, border: 'none', borderBottom: '1px solid transparent',
                    outline: 'none', fontSize: 14, color: '#3f3f46', paddingBottom: 2,
                    background: 'transparent', fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderBottomColor = '#2563eb' }}
                  onBlur={e => { e.target.style.borderBottomColor = 'transparent' }}
                />
                <button
                  onClick={() => removeOption(i)}
                  style={{ background: 'none', border: 'none', color: '#d4d4d8', fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#d4d4d8' }}
                >×</button>
              </div>
              {['radio', 'dropdown'].includes(question.type) && otherSections.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 34, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: '#d4d4d8' }}>↳</span>
                  <select
                    value={question.branching?.[opt] ?? ''}
                    onChange={e => setBranch(opt, e.target.value)}
                    style={{ fontSize: 11, color: '#8c959f', border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer' }}
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
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 8px', borderRadius: 8,
              background: 'none', border: 'none',
              fontSize: 13, color: '#8c959f', cursor: 'pointer',
              textAlign: 'left', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#2563eb' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8c959f' }}
          >
            {question.type === 'checkbox'
              ? <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #c8d0dc', flexShrink: 0 }} />
              : question.type === 'dropdown'
              ? <span style={{ fontSize: 13, color: '#d4d4d8', width: 18, flexShrink: 0, textAlign: 'center' }}>{(question.options?.length ?? 0) + 1}.</span>
              : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #c8d0dc', flexShrink: 0 }} />
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
      style={{
        ...style,
        background: '#fff',
        border: isExpanded ? '2px solid #2563eb' : '1px solid #c8d0dc',
        borderRadius: 10,
        transition: 'border-color 0.15s',
      }}
    >
      {/* ── 접힌 상태 ────────────────────────────── */}
      {!isExpanded && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', cursor: 'pointer' }}
          onClick={onToggle}
        >
          <button
            {...attributes} {...listeners}
            onClick={e => e.stopPropagation()}
            style={{ background: 'none', border: 'none', color: '#d4d4d8', cursor: 'grab', fontSize: 16, padding: 0, touchAction: 'none', lineHeight: 1 }}
          >⠿</button>
          <p style={{ flex: 1, fontSize: 14, color: question.label ? '#3f3f46' : '#d4d4d8', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontStyle: question.label ? 'normal' : 'italic' }}>
            {question.label || '질문 내용 없음'}
          </p>
          <span style={{ fontSize: 11, color: '#8c959f', flexShrink: 0 }}>{TYPE_OPTIONS.find(t => t.value === question.type)?.label}</span>
          {question.required && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>*</span>}
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            style={{ background: '#fff', border: '1px solid #fee2e2', color: '#ef4444', fontSize: 13, padding: '3px 8px', borderRadius: 6, cursor: 'pointer', flexShrink: 0, fontWeight: 700 }}
          >×</button>
        </div>
      )}

      {/* ── 펼친 상태 ────────────────────────────── */}
      {isExpanded && (
        <div>
          {/* 드래그 + 닫기 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 4px' }}>
            <button
              {...attributes} {...listeners}
              style={{ background: 'none', border: 'none', color: '#d4d4d8', cursor: 'grab', fontSize: 16, padding: 0, touchAction: 'none', lineHeight: 1 }}
            >⠿</button>
            <button
              onClick={onDelete}
              style={{ background: '#fff', border: '1px solid #fee2e2', color: '#ef4444', fontSize: 13, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700 }}
            >삭제</button>
          </div>

          {/* 질문 입력 */}
          <div style={{ padding: '4px 16px' }}>
            <input
              value={question.label}
              onChange={e => onChange({ label: e.target.value })}
              placeholder={question.type === 'info' ? 'PDF 제목 (선택)' : '질문'}
              style={underlineInput}
              autoFocus
              onFocus={e => { e.target.style.borderBottomColor = '#2563eb' }}
              onBlur={e => { e.target.style.borderBottomColor = '#c8d0dc' }}
            />
          </div>

          {/* 답변 영역 */}
          <div style={{ padding: '0 16px' }}>
            <AnswerArea question={question} onChange={onChange} sections={sections} currentSectionId={sectionId} />
          </div>

          {/* ── 채점 (info 제외) ── */}
          {question.type !== 'info' && (
            <>
              <div style={{ borderTop: '1px solid #f4f4f6', margin: '14px 16px 0' }} />
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>정답</div>
                  {question.type === 'omr' ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Array.from({ length: question.omrCount ?? 5 }, (_, i) => i + 1).map(n => (
                        <button
                          key={n}
                          onClick={() => onChange({ correctAnswer: question.correctAnswer === String(n) ? undefined : String(n) })}
                          style={{
                            width: 32, height: 32, borderRadius: '50%',
                            border: question.correctAnswer === String(n) ? '2px solid #2563eb' : '2px solid #d4d4d8',
                            background: question.correctAnswer === String(n) ? '#2563eb' : '#fff',
                            color: question.correctAnswer === String(n) ? '#fff' : '#52525b',
                            fontSize: 13, fontWeight: 700, cursor: 'pointer',
                          }}
                        >{circled(n)}</button>
                      ))}
                    </div>
                  ) : question.type === 'ox' ? (
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['O', 'X'].map(v => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#52525b', cursor: 'pointer' }}>
                          <input type="radio" name={`ox-${question.id}`}
                            checked={question.correctAnswer === v}
                            onChange={() => onChange({ correctAnswer: v })}
                            style={{ accentColor: '#2563eb', cursor: 'pointer' }} />
                          {v}
                        </label>
                      ))}
                      {question.correctAnswer && (
                        <button onClick={() => onChange({ correctAnswer: undefined })}
                          style={{ background: 'none', border: 'none', fontSize: 11, color: '#d4d4d8', cursor: 'pointer' }}>지우기</button>
                      )}
                    </div>
                  ) : question.type === 'checkbox' ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(question.options ?? []).map(opt => (
                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#52525b', cursor: 'pointer' }}>
                          <input type="checkbox"
                            checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(opt)}
                            onChange={e => {
                              const prev = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
                              const next = e.target.checked ? [...prev, opt] : prev.filter(v => v !== opt)
                              onChange({ correctAnswer: next.length ? next : undefined })
                            }}
                            style={{ accentColor: '#2563eb', cursor: 'pointer' }} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : ['radio', 'dropdown'].includes(question.type) ? (
                    <select
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      style={{ fontSize: 13, color: '#52525b', border: '1px solid #c8d0dc', borderRadius: 6, padding: '5px 10px', background: '#fff', outline: 'none' }}
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
                      style={{ width: '100%', fontSize: 13, color: '#52525b', border: '1px solid #c8d0dc', borderRadius: 8, padding: '8px 10px', background: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                      onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                      onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
                    />
                  ) : question.type === 'date' ? (
                    <input
                      type="date"
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      style={{ fontSize: 13, color: '#52525b', border: '1px solid #c8d0dc', borderRadius: 6, padding: '5px 10px', background: '#fff', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                      onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
                    />
                  ) : question.type === 'number' ? (
                    <input
                      type="number"
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      placeholder="정답 숫자"
                      style={{ fontSize: 13, color: '#52525b', border: 'none', borderBottom: '1px solid #c8d0dc', outline: 'none', background: 'transparent', width: 80, paddingBottom: 4 }}
                    />
                  ) : (
                    <input
                      value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                      onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                      placeholder="없음"
                      style={{ fontSize: 13, color: '#52525b', border: 'none', borderBottom: '1px solid #c8d0dc', outline: 'none', background: 'transparent', width: '100%', paddingBottom: 4, boxSizing: 'border-box', fontFamily: 'inherit' }}
                    />
                  )}
                </div>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>배점</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="number" min={0}
                      value={question.points ?? ''}
                      onChange={e => onChange({ points: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="—"
                      style={{ width: 52, fontSize: 13, color: '#3f3f46', border: '1px solid #c8d0dc', borderRadius: 6, padding: '5px 8px', textAlign: 'center', background: '#fff', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                      onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
                    />
                    <span style={{ fontSize: 12, color: '#8c959f' }}>점</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── 유형 + 필수 ── */}
          <div style={{ borderTop: '1px solid #f4f4f6', margin: '0 16px' }} />
          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <select
              value={question.type}
              onChange={e => onChange({
                type: e.target.value as QuestionType,
                options: [],
                correctAnswer: undefined,
                branching: undefined,
              })}
              style={{ fontSize: 13, color: '#52525b', border: '1px solid #c8d0dc', borderRadius: 8, padding: '6px 10px', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              {TYPE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {question.type !== 'info' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ fontSize: 13, color: question.required ? '#ef4444' : '#8c959f' }}>필수</span>
                <div
                  onClick={() => onChange({ required: !question.required })}
                  style={{
                    position: 'relative', width: 40, height: 22, borderRadius: 999,
                    background: question.required ? '#ef4444' : '#d4d4d8',
                    transition: 'background 0.2s', cursor: 'pointer',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                    left: question.required ? 21 : 3,
                  }} />
                </div>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
