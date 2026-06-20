import type { Question, QuestionType, Section } from '../../types'

const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'short', label: '단답형' },
  { value: 'long', label: '장문형' },
  { value: 'radio', label: '객관식' },
  { value: 'checkbox', label: '다중선택' },
  { value: 'ox', label: 'O/X' },
  { value: 'dropdown', label: '드롭다운' },
  { value: 'date', label: '날짜' },
  { value: 'number', label: '숫자' },
  { value: 'info', label: '안내문+링크' },
]

interface Props {
  question: Question
  sections: Section[]
  currentSectionId: string
  onChange: (updates: Partial<Question>) => void
}

export default function QuestionEditor({ question, sections, currentSectionId, onChange }: Props) {
  const hasOptions = ['radio', 'checkbox', 'dropdown'].includes(question.type)
  const isOX = question.type === 'ox'
  const isInfo = question.type === 'info'
  const canGrade = !isInfo

  const addOption = () => {
    const options = [...(question.options ?? []), `선택지 ${(question.options?.length ?? 0) + 1}`]
    onChange({ options })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...(question.options ?? [])]
    const oldValue = options[index]
    options[index] = value
    if (question.branching && oldValue in question.branching) {
      const branching = { ...question.branching, [value]: question.branching[oldValue] }
      delete branching[oldValue]
      onChange({ options, branching })
    } else {
      onChange({ options })
    }
  }

  const removeOption = (index: number) => {
    const options = [...(question.options ?? [])]
    const removed = options.splice(index, 1)[0]
    const branching = { ...question.branching }
    delete branching[removed]
    onChange({ options, branching: Object.keys(branching).length ? branching : undefined })
  }

  const updateBranching = (optionValue: string, sectionId: string) => {
    const branching = { ...(question.branching ?? {}) }
    if (!sectionId) delete branching[optionValue]
    else branching[optionValue] = sectionId
    onChange({ branching: Object.keys(branching).length ? branching : undefined })
  }

  const otherSections = sections.filter(s => s.id !== currentSectionId)

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400'

  return (
    <div className="space-y-4">

      {/* Row 1: 유형 + 필수 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 mb-1">질문 유형</p>
          <select
            value={question.type}
            onChange={e => onChange({
              type: e.target.value as QuestionType,
              options: [],
              correctAnswer: undefined,
              branching: undefined,
            })}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {!isInfo && (
          <div className="shrink-0 mt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => onChange({ required: !question.required })}
                className={`w-8 h-4 rounded-full transition-colors ${question.required ? 'bg-red-400' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${question.required ? 'translate-x-4' : 'translate-x-0'}`} style={{ transform: question.required ? 'translateX(16px)' : 'translateX(0)' }} />
              </div>
              <span className={`text-sm font-medium ${question.required ? 'text-red-500' : 'text-gray-400'}`}>필수</span>
            </label>
          </div>
        )}
      </div>

      {/* Row 2: 질문 내용 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">{isInfo ? '안내 텍스트' : '질문 내용'}</p>
        <input
          value={question.label}
          onChange={e => onChange({ label: e.target.value })}
          placeholder={isInfo ? '안내 내용을 입력하세요' : '질문을 입력하세요'}
          className={inputCls}
        />
      </div>

      {/* Info: link fields */}
      {isInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">링크 텍스트</p>
            <input
              value={question.linkText ?? ''}
              onChange={e => onChange({ linkText: e.target.value })}
              placeholder="예: 개인정보 처리방침 확인하기"
              className={inputCls}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">링크 URL</p>
            <input
              value={question.linkUrl ?? ''}
              onChange={e => onChange({ linkUrl: e.target.value })}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </div>
      )}

      {/* Options */}
      {hasOptions && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">선택지</p>
          <div className="space-y-2">
            {(question.options ?? []).map((opt, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-300 text-sm w-4 shrink-0">{i + 1}.</span>
                  <input
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button onClick={() => removeOption(i)} className="text-gray-300 hover:text-red-400 text-xl leading-none w-6">×</button>
                </div>
                {['radio', 'dropdown'].includes(question.type) && otherSections.length > 0 && (
                  <div className="flex items-center gap-2 pl-6">
                    <span className="text-xs text-gray-400 shrink-0">↳ 선택 시:</span>
                    <select
                      value={question.branching?.[opt] ?? ''}
                      onChange={e => updateBranching(opt, e.target.value)}
                      className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none text-gray-600"
                    >
                      <option value="">다음 섹션으로</option>
                      {otherSections.map(s => (
                        <option key={s.id} value={s.id}>{s.title || '(제목 없음)'}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-sm text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              + 선택지 추가
            </button>
          </div>
        </div>
      )}

      {/* O/X */}
      {isOX && (
        <div className="flex gap-6">
          {['O', 'X'].map(v => (
            <div key={v} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
              {v}
            </div>
          ))}
          <span className="text-xs text-gray-400 self-center">(고정 선택지)</span>
        </div>
      )}

      {/* Grading */}
      {canGrade && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-3">
          <p className="text-xs font-semibold text-emerald-700">채점 설정 <span className="font-normal text-emerald-500">(선택 — 비워두면 채점 안 함)</span></p>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">정답</p>
              {question.type === 'checkbox' ? (
                <div className="space-y-1">
                  {(question.options ?? []).map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(opt)}
                        onChange={e => {
                          const prev = Array.isArray(question.correctAnswer) ? question.correctAnswer : []
                          const next = e.target.checked ? [...prev, opt] : prev.filter(v => v !== opt)
                          onChange({ correctAnswer: next.length ? next : undefined })
                        }}
                        className="w-4 h-4 accent-emerald-500"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : isOX ? (
                <div className="flex gap-4">
                  {['O', 'X'].map(v => (
                    <label key={v} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        name={`ox-${question.id}`}
                        checked={question.correctAnswer === v}
                        onChange={() => onChange({ correctAnswer: v })}
                        className="accent-emerald-500"
                      />
                      {v}
                    </label>
                  ))}
                  {question.correctAnswer && (
                    <button onClick={() => onChange({ correctAnswer: undefined })} className="text-xs text-gray-300 hover:text-red-400">지우기</button>
                  )}
                </div>
              ) : ['radio', 'dropdown'].includes(question.type) ? (
                <select
                  value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                  onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                >
                  <option value="">정답 없음</option>
                  {(question.options ?? []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={typeof question.correctAnswer === 'string' ? question.correctAnswer : ''}
                  onChange={e => onChange({ correctAnswer: e.target.value || undefined })}
                  placeholder="정답 입력"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none"
                />
              )}
            </div>
            <div className="w-20 shrink-0">
              <p className="text-xs text-gray-500 mb-1">배점</p>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={question.points ?? ''}
                  onChange={e => onChange({ points: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">점</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
