import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'

interface Banner {
  id: string; badge: string; title: string; sub: string
  bg: string; image?: string; cta: string; link: string; order: number
}

const FALLBACK_BANNERS: Banner[] = [
  { id: '1', badge: '디미고 합격률 1위', title: '9년 누적 212명 합격', sub: '특성화고 입시 전문, 인코딩플러스가 함께합니다.', bg: 'linear-gradient(135deg, #002B5C 0%, #2563eb 100%)', cta: '수업 보기', link: '/courses', order: 0 },
  { id: '2', badge: '2026 디미고 입시 결과', title: '디미고 37명 합격', sub: '2025년 35명 · 2024년 37명 · 2023년 35명 합격', bg: 'linear-gradient(135deg, #001233 0%, #003580 100%)', cta: '합격 실적 보기', link: '/courses', order: 1 },
  { id: '3', badge: '특성화고 전 전형 대비', title: '선린고 · 단소고 다수 합격', sub: '특별전형부터 일반전형까지 완벽 대비합니다.', bg: 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)', cta: '전형 안내', link: '/courses', order: 2 },
  { id: '4', badge: '입시 상담 문의', title: '010-2838-2391', sub: '지금 바로 1:1 입시 상담을 신청하세요.', bg: 'linear-gradient(135deg, #18181b 0%, #374151 100%)', cta: '수강 신청', link: '/apply', order: 3 },
]

const STATS = [
  { num: '212명', label: '9년 누적 합격' },
  { num: '1위', label: '디미고 합격률' },
  { num: '37명', label: '2026 디미고' },
  { num: '9년', label: '입시 전문' },
]

const FEATURES = [
  { icon: '🎯', title: '특별·일반전형 병행 전략', desc: '한 학원에서 두 전형을 모두 준비합니다. 중간에 전략을 바꿔도 흔들리지 않도록 설계된 커리큘럼입니다.' },
  { icon: '📐', title: '코딩 수학 전문 교육', desc: '디미고 소질적성검사에 특화된 C언어·정보소양·논리 수학을 체계적으로 학습합니다.' },
  { icon: '📝', title: '논술·면접까지 완성', desc: '자기소개서, 실적설명서 작성부터 면접까지 — 입시의 모든 단계를 함께합니다.' },
]

const COURSES_PREVIEW = [
  { tag: 'COURSE 01', name: '입시 단기특강', sub: '특별전형 + 일반전형 병행 · 16주', items: ['특전 실적물 제작', '코딩 수학 / 정보 교육', '자소서 · 면접 완성'], color: '#1d4ed8', bg: '#dbeafe' },
  { tag: 'COURSE 02', name: '일반전형 특강', sub: '일반전형 집중 준비 · 16주', items: ['코딩 수학 집중', '정보 교육 심화', '면접 · 자기소개서'], color: '#1d4ed8', bg: '#eff6ff' },
]

export default function Home() {
  const navigate = useNavigate()
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS)
  const [slide, setSlide] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    getDocs(query(collection(db, 'banners'), orderBy('order')))
      .then(snap => { if (!snap.empty) setBanners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Banner))) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 4500)
    return () => clearInterval(t)
  }, [banners.length])

  const prev = () => setSlide(s => (s - 1 + banners.length) % banners.length)
  const next = () => setSlide(s => (s + 1) % banners.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div>

      {/* ══ SECTION 1: 히어로 슬라이더 ══ */}
      <div style={{ background: '#fff', padding: '16px 16px 0' }}>
        <div className="md:max-w-[1100px] md:mx-auto">
          <div
            style={{ position: 'relative', height: 264, borderRadius: 18, overflow: 'hidden' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {banners.map((b, i) => (
              <div
                key={b.id}
                style={{
                  position: 'absolute', inset: 0,
                  background: b.bg,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  ...(b.image ? { backgroundImage: `url(${b.image})` } : {}),
                  opacity: i === slide ? 1 : 0,
                  transition: 'opacity 0.45s ease',
                  pointerEvents: i === slide ? 'auto' : 'none',
                }}
              >
                {/* 텍스트 가독성 오버레이 */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 100%)',
                }} />
                <div style={{ position: 'relative', zIndex: 1, padding: '24px 24px 56px', height: '100%' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.08em', marginBottom: 10 }}>{b.badge}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.03em', color: '#fff', marginBottom: 8, whiteSpace: 'pre-line' }}>{b.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{b.sub}</div>
                  <button
                    onClick={() => navigate(b.link)}
                    className="hover-btn"
                    style={{ marginTop: 16, background: '#fff', color: '#18181b', border: 'none', borderRadius: 9, padding: '10px 18px', fontWeight: 700, fontSize: 13 }}
                  >
                    {b.cta}
                  </button>
                </div>
              </div>
            ))}

            {/* 화살표 — 둘 다 우하단 */}
            <button onClick={prev} aria-label="이전 배너" style={{
              position: 'absolute', right: 44, bottom: 14, zIndex: 2,
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#fff', cursor: 'pointer',
            }}>‹</button>
            <button onClick={next} aria-label="다음 배너" style={{
              position: 'absolute', right: 10, bottom: 14, zIndex: 2,
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: '#fff', cursor: 'pointer',
            }}>›</button>
          </div>

          {/* 도트 — 버튼으로 교체해 터치 타깃 확보 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, padding: '4px 0 10px' }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`${i + 1}번 배너`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '8px 5px',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: i === slide ? 20 : 6, height: 6,
                  borderRadius: 999,
                  background: i === slide ? '#2563eb' : '#d4d4d8',
                  transition: 'all 0.3s',
                }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 2: 합격 실적 ══ */}
      <div style={{ background: '#fafafa', padding: '52px 0' }}>
        <div className="md:max-w-[1100px] md:mx-auto" style={{ padding: '0 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, margin: '0 auto 10px' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 6 }}>합격 실적</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b', marginBottom: 4 }}>9년간 검증된 합격 실적</div>
            <div style={{ fontSize: 13, color: '#52525b' }}>매년 디미고 · 특성화고에 합격생을 배출한 입시 전문 학원입니다</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map(s => (
              <div
                key={s.label}
                className="hover-card"
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '20px 12px',
                  textAlign: 'center',
                  border: '1px solid #c8d0dc',
                  boxShadow: '0 1px 4px rgba(0,55,112,0.06)',
                }}
              >
                <div style={{ fontSize: 30, fontWeight: 800, color: '#2563eb', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#52525b', marginTop: 6, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '12px 16px', background: '#fff', borderRadius: 10, textAlign: 'center', fontSize: 13, color: '#3f3f46', border: '1px solid #c8d0dc' }}>
            <span style={{ color: '#1d4ed8', fontWeight: 700 }}>선린고 · 단소고</span> 등 서울·경기 특성화고 다수 합격
          </div>
        </div>
      </div>

      {/* ══ SECTION 3: WHY 인코딩플러스 ══ */}
      <div style={{ background: '#fff', padding: '52px 0' }}>
        <div className="md:max-w-[1100px] md:mx-auto" style={{ padding: '0 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, margin: '0 auto 10px' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 6 }}>WHY 인코딩플러스</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b' }}>IT와 국어, 두 축으로 준비합니다</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="hover-card"
                style={{
                  background: '#fff',
                  border: '1px solid #c8d0dc',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 2px 8px rgba(0,55,112,0.07)',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#18181b', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#52525b', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 4: 개설 강좌 ══ */}
      <div style={{ background: '#fafafa', padding: '52px 0' }}>
        <div className="md:max-w-[1100px] md:mx-auto" style={{ padding: '0 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
            <div>
              <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', marginBottom: 4 }}>COURSES</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#18181b' }}>개설 강좌</div>
            </div>
            <button
              onClick={() => navigate('/courses')}
              className="nav-btn"
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 13, fontWeight: 600, padding: '6px 10px', borderRadius: 8 }}
            >
              수업 상세 →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES_PREVIEW.map(c => (
              <div
                key={c.name}
                className="hover-card"
                onClick={() => navigate('/courses')}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid #c8d0dc',
                  boxShadow: '0 1px 4px rgba(0,55,112,0.06)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ background: c.bg, borderBottom: `1px solid ${c.color}22`, padding: '18px 20px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: `${c.color}18`, padding: '3px 9px', borderRadius: 6 }}>{c.tag}</span>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#18181b', marginTop: 8 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#52525b', marginTop: 3 }}>{c.sub}</div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                    {c.items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#3f3f46', fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  {/* stopPropagation: 카드 클릭(/courses)과 신청 버튼(/apply) 목적지 충돌 방지 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/apply') }}
                    className="hover-btn"
                    style={{ width: '100%', background: c.color, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0', fontWeight: 700, fontSize: 14 }}
                  >
                    수강 신청하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECTION 5: 상담 CTA + 푸터 ══ */}
      <div className="dark-cta-bottom" style={{ background: '#18181b', padding: '32px 20px 0', textAlign: 'center' }}>
        <div className="md:max-w-[600px] md:mx-auto">
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>지금 바로 수강 신청하세요</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6, lineHeight: 1.6 }}>이번주 주말부터 시작합니다 · 선착순 마감</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => navigate('/apply')}
              className="hover-btn"
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 40px', fontWeight: 800, fontSize: 15 }}
            >
              수강 신청하기
            </button>
            <a href="tel:01028382391" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              전화 상담 010-2838-2391
            </a>
          </div>
          <div style={{ marginTop: 32, paddingTop: 16, paddingBottom: 8, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#52525b' }}>
            인코딩플러스 · 디미고 · 특성화고 입시 전문 · 사업자등록번호 110-96-08049
          </div>
        </div>
      </div>

    </div>
  )
}
