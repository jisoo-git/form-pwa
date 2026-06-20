import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Form, Question } from '../types'

const circled = (n: number) => String.fromCodePoint(0x2460 + n - 1)

export default function FormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [sectionIdx, setSectionIdx] = useState(0)
  const [sectionHistory, setSectionHistory] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, 'forms', id)).then(snap => {
      if (!snap.exists() || !(snap.data() as Form).isActive) {
        setNotFound(true)
      } else {
        setForm({ id: snap.id, ...snap.data() } as Form)
      }
      setLoaded(true)
    })
  }, [id])

  const section = form?.sections[sectionIdx]
  const isLastSection = !!form && sectionIdx === form.sections.length - 1

  const setAnswer = (qId: string, value: string | string[]) =>
    setAnswers(prev => ({ ...prev, [qId]: value }))

  const toggleCheckbox = (qId: string, option: string) =>
    setAnswers(prev => {
      const cur = (prev[qId] as string[] | undefined) ?? []
      return { ...prev, [qId]: cur.includes(option) ? cur.filter(v => v !== option) : [...cur, option] }
    })

  const isBlocked = (section?.questions ?? []).some(q => {
    if (!q.branching) return false
    const ans = answers[q.id] as string | undefined
    return !!ans && q.branching[ans] === '__end__'
  })

  const handleBack = () => {
    if (sectionHistory.length === 0) return
    const prev = sectionHistory[sectionHistory.length - 1]
    setSectionHistory(h => h.slice(0, -1))
    setSectionIdx(prev)
    setErrors([])
  }

  const handleNext = () => {
    if (isBlocked) return

    const missing = (section?.questions ?? [])
      .filter(q => q.required && q.type !== 'info')
      .filter(q => {
        const ans = answers[q.id]
        return !ans || (Array.isArray(ans) && ans.length === 0) || ans === ''
      })
      .map(q => q.id)

    if (missing.length > 0) { setErrors(missing); return }
    setErrors([])

    let nextIdx: number | null = null
    for (const q of section!.questions) {
      if (!q.branching) continue
      if (q.type === 'radio' || q.type === 'dropdown' || q.type === 'ox') {
        const ans = answers[q.id] as string | undefined
        if (ans && q.branching[ans] && q.branching[ans] !== '__end__') {
          const idx = form!.sections.findIndex(s => s.id === q.branching![ans])
          if (idx !== -1) { nextIdx = idx; break }
        }
      }
    }

    setSectionHistory(h => [...h, sectionIdx])
    if (nextIdx !== null) {
      setSectionIdx(nextIdx)
    } else if (!isLastSection) {
      setSectionIdx(i => i + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    let score: number | undefined, totalScore: number | undefined

    if (form!.type === 'quiz') {
      let s = 0, t = 0
      for (const sec of form!.sections) {
        for (const q of sec.questions) {
          if (q.correctAnswer === undefined || !q.points) continue
          t += q.points
          const ans = answers[q.id]
          if (Array.isArray(q.correctAnswer)) {
            const given = (Array.isArray(ans) ? [...ans] : [ans as string]).sort()
            if (JSON.stringify(given) === JSON.stringify([...q.correctAnswer].sort())) s += q.points
          } else {
            if (ans === q.correctAnswer) s += q.points
          }
        }
      }
      score = s; totalScore = t
    }

    await addDoc(collection(db, 'responses'), {
      formId: id!,
      respondentName: '',
      submittedAt: serverTimestamp(),
      answers,
      ...(score !== undefined ? { score, totalScore } : {}),
    })

    if (score !== undefined && totalScore !== undefined) setResult({ score, total: totalScore })
    setSubmitting(false)
    setDone(true)
    setTimeout(() => navigate('/'), 1000)
  }

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 bg-slate-100">불러오는 중...</div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-4xl mb-2">😢</p>
      <p className="font-bold text-gray-800">폼을 찾을 수 없습니다</p>
      <p className="text-sm text-gray-500">비활성화되었거나 존재하지 않는 폼이에요.</p>
    </div>
  )

  if (done) return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-8 w-full max-w-sm text-center">
        <p className="text-4xl mb-4">{result ? '📊' : '✅'}</p>
        <p className="font-black text-xl text-gray-900 mb-2">{result ? '채점 결과' : '제출 완료!'}</p>
        {result ? (
          <>
            <p className="text-5xl font-black text-blue-600 my-4">
              {result.score}<span className="text-xl text-gray-400 font-semibold"> / {result.total}</span>
            </p>
            <p className="text-sm text-gray-500">정답률 {result.total > 0 ? Math.round((result.score / result.total) * 100) : 0}%</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">응답이 정상적으로 제출되었습니다.<br />감사합니다!</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 shadow-sm sticky top-0 z-10">
        <p className="font-black text-base text-gray-900">{form!.title}</p>
        {form!.sections.length > 1 && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${((sectionIdx + 1) / form!.sections.length) * 100}%` }} />
            </div>
            <span className="text-xs text-gray-500 shrink-0">{sectionIdx + 1} / {form!.sections.length}</span>
          </div>
        )}
      </div>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-3">
        {section!.title && (
          <div className="bg-blue-600 text-white rounded-2xl px-5 py-3">
            <p className="font-bold text-sm">{section!.title}</p>
          </div>
        )}

        {section!.questions.map((q, qi) => (
          <QuestionCard
            key={q.id}
            q={q}
            qi={qi}
            answer={answers[q.id]}
            hasError={errors.includes(q.id)}
            onChange={val => setAnswer(q.id, val)}
            onToggle={opt => toggleCheckbox(q.id, opt)}
          />
        ))}

        {isBlocked && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 text-sm text-red-600 font-medium text-center">
            이 답변으로는 계속 진행할 수 없습니다.
          </div>
        )}

        {/* 이전 / 다음 버튼 */}
        <div className={`flex gap-2 ${sectionHistory.length > 0 ? '' : ''}`}>
          {sectionHistory.length > 0 && (
            <button
              onClick={handleBack}
              className="px-5 py-3.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
            >
              ← 이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={submitting || isBlocked}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            {submitting ? '제출 중...' : isLastSection ? '제출하기' : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function QuestionCard({ q, qi, answer, hasError, onChange, onToggle }: {
  q: Question; qi: number; answer: string | string[] | undefined
  hasError: boolean; onChange: (val: string) => void; onToggle: (opt: string) => void
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm px-5 py-4 border ${hasError ? 'border-red-400' : 'border-gray-300'}`}>
      <div className="flex items-start gap-1.5 mb-3">
        <span className="text-xs text-gray-400 font-semibold mt-0.5 shrink-0">Q{qi + 1}.</span>
        <p className="text-sm font-semibold text-gray-900 flex-1 leading-snug">
          {q.label || '(제목 없음)'}
          {q.required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
      </div>
      {hasError && <p className="text-xs text-red-500 -mt-1 mb-2 ml-5">필수 항목입니다.</p>}

      {q.type === 'short' && (
        <input value={(answer as string) ?? ''} onChange={e => onChange(e.target.value)}
          placeholder="답변을 입력하세요"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
      )}
      {q.type === 'long' && (
        <textarea value={(answer as string) ?? ''} onChange={e => onChange(e.target.value)}
          placeholder="답변을 입력하세요" rows={4}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition resize-none" />
      )}
      {q.type === 'number' && (
        <input type="number" value={(answer as string) ?? ''} onChange={e => onChange(e.target.value)}
          placeholder="숫자를 입력하세요"
          className="w-40 border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
      )}
      {q.type === 'date' && (
        <input type="date" value={(answer as string) ?? ''} onChange={e => onChange(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition" />
      )}
      {q.type === 'radio' && (
        <div className="space-y-2">
          {(q.options ?? []).map(opt => (
            <button key={opt} onClick={() => onChange(opt)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-left transition-colors ${
                answer === opt ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${answer === opt ? 'border-blue-600' : 'border-gray-300'}`}>
                {answer === opt && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
              <span className={`text-sm ${answer === opt ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>{opt}</span>
            </button>
          ))}
        </div>
      )}
      {q.type === 'checkbox' && (
        <div className="space-y-2">
          {(q.options ?? []).map(opt => {
            const checked = (answer as string[] | undefined)?.includes(opt) ?? false
            return (
              <button key={opt} onClick={() => onToggle(opt)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-left transition-colors ${
                  checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                  {checked && <span className="text-white text-xs font-black leading-none">✓</span>}
                </div>
                <span className={`text-sm ${checked ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>{opt}</span>
              </button>
            )
          })}
        </div>
      )}
      {q.type === 'dropdown' && (
        <select value={(answer as string) ?? ''} onChange={e => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white">
          <option value="">선택하세요</option>
          {(q.options ?? []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
      {q.type === 'ox' && (
        <div className="flex gap-3 mt-1">
          {['O', 'X'].map(v => (
            <button key={v} onClick={() => onChange(v)}
              className={`flex-1 py-4 rounded-xl text-2xl font-black transition-colors border-2 ${
                answer === v
                  ? v === 'O' ? 'bg-blue-600 text-white border-blue-600' : 'bg-red-500 text-white border-red-500'
                  : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600'}`}>
              {v}
            </button>
          ))}
        </div>
      )}
      {q.type === 'omr' && (
        <div className="flex flex-wrap gap-2 mt-1">
          {Array.from({ length: q.omrCount ?? 5 }, (_, i) => i + 1).map(n => {
            const val = String(n)
            const selected = answer === val
            return (
              <button key={n} onClick={() => onChange(val)}
                className={`w-11 h-11 rounded-full text-lg font-bold transition-colors border-2 ${
                  selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}>
                {circled(n)}
              </button>
            )
          })}
        </div>
      )}
      {q.type === 'info' && q.linkUrl && (
        <a href={q.linkUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
          📄 PDF 열기
        </a>
      )}
    </div>
  )
}
