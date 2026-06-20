import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import AdminLayout from '../../components/ui/AdminLayout'
import type { Form, Response } from '../../types'

function formatDate(ts: { toDate?: () => Date } | undefined) {
  if (!ts?.toDate) return '-'
  const d = ts.toDate()
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Responses() {
  const { formId } = useParams()
  const [form, setForm] = useState<Form | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!formId) return
    Promise.all([
      getDoc(doc(db, 'forms', formId)),
      getDocs(query(
        collection(db, 'responses'),
        where('formId', '==', formId),
      )),
    ]).then(([formSnap, respSnap]) => {
      if (formSnap.exists()) setForm({ id: formSnap.id, ...formSnap.data() } as Form)
      const sorted = respSnap.docs
        .map(d => ({ id: d.id, ...d.data() } as Response))
        .sort((a, b) => {
          const ta = (a.submittedAt as any)?.toDate?.()?.getTime() ?? 0
          const tb = (b.submittedAt as any)?.toDate?.()?.getTime() ?? 0
          return tb - ta
        })
      setResponses(sorted)
    }).finally(() => setLoading(false))
  }, [formId])

  // questionId → label 매핑
  const questionMap = Object.fromEntries(
    (form?.sections ?? []).flatMap(s => s.questions.map(q => [q.id, q.label || '(제목 없음)']))
  )

  const isQuiz = form?.type === 'quiz'

  return (
    <AdminLayout title={form ? `${form.title} — 응답` : '응답'} backTo="/admin/dashboard">
      {loading ? (
        <p className="text-center text-gray-400 py-16">불러오는 중...</p>
      ) : responses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-3">📭</p>
          <p>아직 응답이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 font-medium">총 {responses.length}개 응답</p>
            {isQuiz && responses.some(r => r.score !== undefined) && (
              <p className="text-sm text-gray-500">
                평균{' '}
                <span className="font-bold text-blue-600">
                  {Math.round(
                    responses.filter(r => r.score !== undefined).reduce((s, r) => s + r.score!, 0) /
                    responses.filter(r => r.score !== undefined).length
                  )}점
                </span>
                {' '}/ {responses.find(r => r.totalScore !== undefined)?.totalScore ?? '?'}점
              </p>
            )}
          </div>

          <div className="space-y-2">
            {responses.map(resp => (
              <div key={resp.id} className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                {/* 요약 행 */}
                <button
                  onClick={() => setExpandedId(expandedId === resp.id ? null : resp.id!)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{resp.respondentName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(resp.submittedAt as any)}</p>
                  </div>
                  {isQuiz && resp.score !== undefined && (
                    <span className="text-sm font-black text-blue-600 shrink-0">
                      {resp.score}<span className="text-xs text-gray-400 font-semibold"> / {resp.totalScore}</span>
                    </span>
                  )}
                  <span className="text-gray-400 text-sm">{expandedId === resp.id ? '▲' : '▼'}</span>
                </button>

                {/* 상세 답변 */}
                {expandedId === resp.id && (
                  <div className="border-t border-gray-200 px-5 py-4 space-y-3 bg-slate-50">
                    {Object.entries(resp.answers).map(([qId, ans]) => (
                      <div key={qId}>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">
                          {questionMap[qId] ?? qId}
                        </p>
                        <p className="text-sm text-gray-900">
                          {Array.isArray(ans) ? ans.join(', ') : ans || '-'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
