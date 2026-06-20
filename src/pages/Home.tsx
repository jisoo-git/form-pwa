import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

function useLandingLinks() {
  const [links, setLinks] = useState<{ course1: string; course2: string }>({ course1: '', course2: '' })
  useEffect(() => {
    getDoc(doc(db, 'settings', 'landing'))
      .then(snap => { if (snap.exists()) setLinks(snap.data() as { course1: string; course2: string }) })
      .catch(() => {})
  }, [])
  return links
}

function ApplyButton({ formId, color }: { formId: string; color: 'blue' | 'violet' }) {
  const navigate = useNavigate()

  if (!formId) {
    return (
      <button disabled className="px-5 py-2.5 rounded-xl font-semibold bg-white/20 text-white/50 cursor-not-allowed text-sm border border-white/20">
        신청 준비 중
      </button>
    )
  }

  return (
    <button
      onClick={() => navigate(`/form/${formId}`)}
      className={`px-5 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm cursor-pointer bg-white border border-white
        ${color === 'blue' ? 'text-blue-800 hover:bg-blue-50' : 'text-violet-800 hover:bg-violet-50'}`}
    >
      신청 폼으로 →
    </button>
  )
}

export default function Home() {
  const links = useLandingLinks()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-200">

      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-blue-800 font-black text-xl">인코딩</span>
          <span className="font-black text-xl text-gray-900">플러스</span>
        </div>
        <button onClick={() => navigate('/admin')} className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium cursor-pointer">
          관리자
        </button>
      </header>

      {/* 히어로 */}
      <section className="bg-gray-50 px-6 py-12 text-center border-b border-gray-200">
        <p className="text-blue-800 font-semibold text-xs tracking-widest mb-2">2027학년도 디미고 입시</p>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-3">
          합격을 위한 <span className="text-blue-800">단 하나의 선택</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          특별전형부터 일반전형까지, 인코딩 플러스와 함께 준비하세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => document.getElementById('course-1')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
          >
            단기특강 보기
          </button>
          <button
            onClick={() => document.getElementById('course-2')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 bg-violet-800 hover:bg-violet-900 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
          >
            일반전형 보기
          </button>
        </div>
      </section>

      {/* 코스 영역 */}
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-4">

        {/* ── COURSE 01: 입시 단기특강 (블루) ── */}
        <div id="course-1" className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="bg-blue-800 px-5 py-4">
            <p className="text-blue-300 font-semibold text-xs mb-0.5">COURSE 01 · 16주 과정</p>
            <h2 className="text-xl font-black text-white">입시 단기특강</h2>
            <p className="text-blue-300 text-xs mt-0.5">특별전형 + 일반전형 병행 전략</p>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* 월별 커리큘럼 */}
            <div>
              <p className="text-xs font-bold text-blue-800 mb-2 tracking-wide">월별 커리큘럼</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { month: '7월', content: '주제 선정\n코딩 수학' },
                  { month: '8월', content: '실적물 제작\n수학 실전' },
                  { month: '9월', content: '이론 수업\n정보 학습' },
                  { month: '10월', content: '자료 준비\n모의고사' },
                ].map(({ month, content }) => (
                  <div key={month} className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <p className="text-blue-800 font-bold text-xs mb-1">{month}</p>
                    <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 영역별 */}
            <div>
              <p className="text-xs font-bold text-blue-800 mb-2 tracking-wide">영역별 학습</p>
              <div className="space-y-1.5">
                {[
                  { area: '특전 대비', desc: '실적물 작업 · 이론 교육' },
                  { area: '일전 대비', desc: '코딩 수학 · 정보 교육' },
                  { area: '논술 대비', desc: '자소서 · 실적설명서 · 면접' },
                ].map(({ area, desc }) => (
                  <div key={area} className="flex items-center gap-3 py-2 px-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-xs font-bold text-blue-800 w-16 shrink-0">{area}</span>
                    <span className="text-xs text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 시간표 */}
            <div>
              <p className="text-xs font-bold text-blue-800 mb-2 tracking-wide">수업 시간</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { day: '매주 토요일', time: '12:00 – 18:00', note: '대면 6시간' },
                  { day: '매주 수요일', time: '저녁 1시간', note: '비대면 · 보충 불가' },
                ].map(({ day, time, note }) => (
                  <div key={day} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-800">{day}</p>
                    <p className="text-sm font-black text-gray-900 mt-0.5">{time}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-xs mb-0.5">월 수강료</p>
                <p className="text-3xl font-black text-white">73<span className="text-lg font-bold">만원</span></p>
              </div>
              <ApplyButton formId={links.course1} color="blue" />
            </div>
          </div>
        </div>

        {/* ── COURSE 02: 일반전형 특강 (바이올렛) ── */}
        <div id="course-2" className="bg-white rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="bg-violet-800 px-5 py-4">
            <p className="text-violet-300 font-semibold text-xs mb-0.5">COURSE 02 · 16주 과정</p>
            <h2 className="text-xl font-black text-white">일반전형 특강</h2>
            <p className="text-violet-300 text-xs mt-0.5">일반전형 집중 전략</p>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* 수업 구성 */}
            <div>
              <p className="text-xs font-bold text-violet-800 mb-2 tracking-wide">수업 구성</p>
              <div className="space-y-1.5">
                {[
                  { area: '코딩 수학', desc: '정보 교육 중심의 수학 학습' },
                  { area: '정보 교육', desc: '디미고 일반전형 대비 이론' },
                  { area: '면접 대비', desc: '자기소개서 · 구술 준비' },
                ].map(({ area, desc }) => (
                  <div key={area} className="flex items-center gap-3 py-2 px-4 bg-violet-50 border border-violet-100 rounded-lg">
                    <span className="text-xs font-bold text-violet-800 w-16 shrink-0">{area}</span>
                    <span className="text-xs text-gray-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 시간표 */}
            <div>
              <p className="text-xs font-bold text-violet-800 mb-2 tracking-wide">수업 시간</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { day: '토 또는 일요일', time: '15:00 – 18:00', note: '대면 3시간' },
                  { day: '매주 수요일', time: '저녁 1시간', note: '비대면 · 보충 불가' },
                ].map(({ day, time, note }) => (
                  <div key={day} className="bg-violet-50 border border-violet-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-violet-800">{day}</p>
                    <p className="text-sm font-black text-gray-900 mt-0.5">{time}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-violet-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-violet-300 text-xs mb-0.5">월 수강료</p>
                <p className="text-3xl font-black text-white">48<span className="text-lg font-bold">만원</span></p>
              </div>
              <ApplyButton formId={links.course2} color="violet" />
            </div>
          </div>
        </div>

        {/* 비교 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-900 text-xs font-bold px-4 py-2.5">
            <span className="text-gray-400">구분</span>
            <span className="text-center text-blue-300">단기특강</span>
            <span className="text-center text-violet-300">일반전형</span>
          </div>
          {[
            { label: '대상', v1: '특별+일반전형', v2: '일반전형만' },
            { label: '주간 수업', v1: '7시간', v2: '4시간' },
            { label: '수업 기간', v1: '16주', v2: '16주' },
            { label: '월 수강료', v1: '73만원', v2: '48만원' },
          ].map(({ label, v1, v2 }, i) => (
            <div key={label} className={`grid grid-cols-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <span className="text-gray-500 text-xs font-semibold">{label}</span>
              <span className="text-center text-blue-800 font-bold text-xs">{v1}</span>
              <span className="text-center text-violet-800 font-bold text-xs">{v2}</span>
            </div>
          ))}
        </div>

      </div>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-5 text-center text-xs mt-2">
        <p className="font-bold text-white text-sm mb-0.5">인코딩 플러스</p>
        <p>2027학년도 디미고 입시 전문</p>
      </footer>
    </div>
  )
}
