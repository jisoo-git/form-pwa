import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

const NOTICES = [
  { id: '1', title: '수업 개설 기준', body: '수업은 최소 2명 이상 등록 시 개설됩니다. 인원 미달 시 개별 안내 후 환불 처리됩니다.' },
  { id: '2', title: '결석·보충 안내', body: '수요일 비대면 수업은 보충이 불가합니다. 대면 수업은 1회에 한해 사전 연락 후 보충 가능합니다.' },
  { id: '3', title: '수강료 납부', body: '수강료는 매월 첫 수업 전까지 납부해 주세요. 미납 시 수업 참여가 제한될 수 있습니다.' },
  { id: '4', title: '환불 규정', body: '수강 취소는 개강 1주일 전까지 전액 환불 가능합니다. 이후 취소 시 이미 진행된 수업 횟수에 따라 차등 환불됩니다.' },
]

type QType = 'text' | 'tel' | 'date' | 'radio'
interface Q { id: string; label: string; type: QType; required: boolean; placeholder?: string; options?: string[] }

const BASE_QUESTIONS: Q[] = [
  { id: 'name', label: '학생 이름', type: 'text', required: true, placeholder: '홍길동' },
  { id: 'school', label: '학교명', type: 'text', required: true, placeholder: '예) 한강중학교' },
  { id: 'grade', label: '학년', type: 'radio', required: true, options: ['중2', '중3'] },
  { id: 'gender', label: '성별', type: 'radio', required: true, options: ['남성', '여성'] },
  { id: 'birth', label: '생년월일', type: 'date', required: true },
  { id: 'parentPhone', label: '부모님 연락처', type: 'tel', required: true, placeholder: '010-0000-0000' },
  { id: 'studentPhone', label: '학생 연락처', type: 'tel', required: false, placeholder: '010-0000-0000 (없으면 빈칸)' },
  { id: 'onlineTime', label: '비대면 수업 시간 선택 (매주 수요일)', type: 'radio', required: true, options: ['오후 10시 (10~11시)', '오후 11시 (11~12시)'] },
]
const GENERAL_EXTRA: Q = { id: 'classDay', label: '수업 요일 선택', type: 'radio', required: true, options: ['토요일', '일요일'] }

export default function Apply() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [privacy, setPrivacy] = useState<string | null>(null)
  const [course, setCourse] = useState<string | null>(null)
  const [noticeChecked, setNoticeChecked] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const questions = course === '일반전형 특강' ? [...BASE_QUESTIONS, GENERAL_EXTRA] : BASE_QUESTIONS
  const step1CanNext = privacy === '네' && course !== null
  const step2CanNext = noticeChecked
  const step3CanSubmit = questions.filter(q => q.required).every(q => (answers[q.id] || '').trim() !== '')

  const setAnswer = (id: string, val: string) => setAnswers(prev => ({ ...prev, [id]: val }))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'submissions'), {
        name: answers.name || '',
        course,
        school: answers.school || '',
        phone: answers.parentPhone || '',
        submittedAt: serverTimestamp(),
        status: 'new',
        detail: answers,
      })
      setSubmitted(true)
    } catch {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="md:max-w-[680px] md:mx-auto md:px-7">

        {/* 진행 표시 — IBM Carbon 스텝 인디케이터 */}
        <div className="step-indicator" style={{ padding: '20px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            {[
              { n: 1, label: '신청 확인' },
              { n: 2, label: '유의사항' },
              { n: 3, label: '정보 입력' },
            ].map(({ n, label }, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: step > n ? '#2563eb' : step === n ? '#2563eb' : '#d4d9e0',
                    border: step === n ? '2px solid #1d4ed8' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: step >= n ? '#fff' : '#a1a1aa',
                    transition: 'all 0.2s',
                    boxShadow: step === n ? '0 0 0 3px #93c5fd' : 'none',
                  }}>
                    {step > n ? '✓' : n}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: step >= n ? '#1d4ed8' : '#a1a1aa', whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {i < 2 && (
                  <div style={{ flex: 1, height: 2, background: step > n ? '#2563eb' : '#d4d9e0', margin: '0 6px', marginBottom: 18, transition: 'background 0.2s' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 18px 24px' }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#18181b', marginBottom: 20 }}>신청 전 확인</div>

              {/* Q1 개인정보 처리방침 */}
              <div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: 20, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,55,112,0.05)' }}>
                <div style={{ fontSize: 12, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>Q1</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#18181b', marginBottom: 12 }}>개인정보 처리방침</div>
                <div style={{ fontSize: 14, color: '#52525b', lineHeight: 1.65, marginBottom: 14 }}>
                  수강신청 시 입력하신 개인정보(이름, 연락처, 학교 등)는 수업 운영 및 안내 목적으로만 사용되며, 제3자에게 제공되지 않습니다.
                </div>
                <button
                  disabled
                  style={{ background: '#f6f9fc', border: 'none', borderRadius: 9, padding: '10px 18px', fontSize: 14, fontWeight: 600, color: '#8c959f', cursor: 'not-allowed' }}
                >
                  처리방침 전문 보기 (준비 중)
                </button>
              </div>

              {/* Q2 동의 여부 */}
              <div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: 20, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,55,112,0.05)' }}>
                <div style={{ fontSize: 12, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>Q2 · 필수</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#18181b', marginBottom: 14 }}>개인 정보 활용에 동의하십니까?</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['네', '아니오'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPrivacy(opt)}
                      style={{
                        flex: 1, padding: '12px 8px',
                        border: privacy === opt ? '2px solid #2563eb' : '1px solid #e5e5ea',
                        borderRadius: 10,
                        background: privacy === opt ? '#dbeafe' : '#fff',
                        fontSize: 15, fontWeight: privacy === opt ? 700 : 500,
                        color: privacy === opt ? '#1d4ed8' : '#52525b',
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {privacy === '아니오' && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', borderRadius: 8, fontSize: 13, color: '#ef4444', fontWeight: 600 }}>
                    동의하지 않으시면 수강 신청을 진행할 수 없습니다.
                  </div>
                )}
              </div>

              {/* Q3 수업 선택 */}
              <div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, color: '#8c959f', fontWeight: 600, marginBottom: 6 }}>Q3 · 필수</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#18181b', marginBottom: 14 }}>원하시는 수업을 선택해주세요</div>
                {[
                  { name: '입시 단기특강', desc: '특별전형 + 일반전형 병행 · 토요일 6h + 수요일 1h' },
                  { name: '일반전형 특강', desc: '일반전형 집중 · 토/일 3h + 수요일 1h' },
                ].map(opt => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setCourse(opt.name)}
                    style={{
                      width: '100%', padding: '14px 16px',
                      border: course === opt.name ? '2px solid #2563eb' : '1px solid #e5e5ea',
                      borderRadius: 12,
                      background: course === opt.name ? '#dbeafe' : '#fff',
                      textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 14,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: course === opt.name ? '6px solid #2563eb' : '2px solid #d4d4d8',
                      background: '#fff',
                    }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#18181b' }}>{opt.name}</div>
                      <div style={{ fontSize: 13, color: '#71717a', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#18181b', marginBottom: 20 }}>유의사항 확인</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {NOTICES.map((n, i) => (
                  <div key={n.id} style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,55,112,0.05)' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', background: '#dbeafe', padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 1 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#18181b', marginBottom: 4 }}>{n.title}</div>
                        <div style={{ fontSize: 13, color: '#52525b', lineHeight: 1.6 }}>{n.body}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setNoticeChecked(v => !v)}
                style={{
                  width: '100%', padding: '16px 18px',
                  border: noticeChecked ? '2px solid #2563eb' : '1px solid #e5e5ea',
                  borderRadius: 12,
                  background: noticeChecked ? '#dbeafe' : '#fff',
                  display: 'flex', alignItems: 'center', gap: 14,
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: noticeChecked ? '#2563eb' : '#fff',
                  border: noticeChecked ? '2px solid #2563eb' : '2px solid #d4d4d8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                }}>
                  {noticeChecked ? '✓' : ''}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: noticeChecked ? '#1d4ed8' : '#52525b' }}>
                  위 유의사항을 모두 확인했습니다
                </span>
              </button>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#18181b' }}>상세 정보 입력</div>
                <div style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>
                  선택 수업: <span style={{ fontWeight: 700, color: '#1d4ed8' }}>{course}</span>
                </div>
              </div>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {questions.map((q, i) => (
                  <div key={q.id} style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,55,112,0.05)' }}>
                    <div style={{ fontSize: 12, color: '#8c959f', fontWeight: 600, marginBottom: 4 }}>
                      Q{i + 1}{q.required ? ' · 필수' : ''}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#18181b', marginBottom: 12 }}>{q.label}</div>

                    {q.type === 'radio' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        {q.options!.map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswer(q.id, opt)}
                            style={{
                              flex: 1, padding: '11px 8px',
                              border: answers[q.id] === opt ? '2px solid #2563eb' : '1px solid #e5e5ea',
                              borderRadius: 10,
                              background: answers[q.id] === opt ? '#dbeafe' : '#fff',
                              fontSize: 14, fontWeight: answers[q.id] === opt ? 700 : 500,
                              color: answers[q.id] === opt ? '#1d4ed8' : '#52525b',
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {(q.type === 'text' || q.type === 'tel') && (
                      <input
                        type={q.type}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                        style={{
                          width: '100%', border: '1px solid #e5e5ea', borderRadius: 10,
                          padding: '12px 14px', fontSize: 15, outline: 'none',
                          background: '#fff', boxSizing: 'border-box',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e5ea' }}
                      />
                    )}

                    {q.type === 'date' && (
                      <input
                        type="date"
                        value={answers[q.id] || ''}
                        onChange={e => setAnswer(q.id, e.target.value)}
                        style={{
                          width: '100%', border: '1px solid #e5e5ea', borderRadius: 10,
                          padding: '12px 14px', fontSize: 15, outline: 'none',
                          background: '#fff', boxSizing: 'border-box',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#2563eb' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e5ea' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 하단 버튼 */}
        <div className="apply-btn-area">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: '0 0 auto', padding: '14px 22px',
                border: '1px solid #e5e5ea', borderRadius: 11,
                background: '#fff', fontSize: 15, fontWeight: 600, color: '#52525b',
              }}
            >
              이전
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 ? !step1CanNext : !step2CanNext}
              style={{
                flex: 1, padding: '14px 0',
                border: 'none', borderRadius: 11,
                background: (step === 1 ? step1CanNext : step2CanNext) ? '#2563eb' : '#93c5fd',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: (step === 1 ? step1CanNext : step2CanNext) ? 'pointer' : 'not-allowed',
              }}
            >
              다음
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={!step3CanSubmit || submitting}
              style={{
                flex: 1, padding: '14px 0',
                border: 'none', borderRadius: 11,
                background: step3CanSubmit && !submitting ? '#2563eb' : '#93c5fd',
                color: '#fff', fontSize: 16, fontWeight: 700,
                cursor: step3CanSubmit && !submitting ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? '제출 중...' : '신청 완료'}
            </button>
          )}
        </div>

      </div>

      {/* ── 제출 완료 모달 ── */}
      {submitted && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 90,
          background: 'rgba(24,24,27,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 28px', textAlign: 'center', width: '100%', maxWidth: 360 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#f0fdf4', border: '2px solid #22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 28, color: '#22c55e',
            }}>
              ✓
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#18181b', marginBottom: 8 }}>신청이 완료되었습니다</div>
            <div style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, marginBottom: 28 }}>
              빠른 시일 내에 연락드리겠습니다.<br />문의: 010-2838-2391
            </div>
            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 11, padding: '14px 0', fontWeight: 700, fontSize: 16 }}
            >
              홈으로
            </button>
          </div>
        </div>
      )}
    </>
  )
}
