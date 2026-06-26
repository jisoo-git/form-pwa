import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { db } from '../firebase/config'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'
import type { Post } from '../types'
import { FALLBACK_POSTS } from './Blog'

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #c8d0dc', borderTop: '3px solid #2563eb',
        borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    async function fetchPost() {
      try {
        const snap = await getDoc(doc(db, 'blogPosts', id as string))
        if (snap.exists()) {
          setPost({ id: snap.id, ...(snap.data() as Omit<Post, 'id'>) })
          updateDoc(snap.ref, { views: increment(1) })
        } else {
          const fallback = FALLBACK_POSTS.find(p => p.id === id)
          fallback ? setPost(fallback) : setNotFound(true)
        }
      } catch {
        const fallback = FALLBACK_POSTS.find(p => p.id === id)
        fallback ? setPost(fallback) : setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  if (loading) return <div style={{ background: '#fff', minHeight: '60vh', paddingTop: 40 }}><Spinner /></div>

  if (notFound || !post) {
    return (
      <div style={{ background: '#fff', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '60px 20px' }}>
        <p style={{ fontSize: 16, color: '#52525b' }}>글을 찾을 수 없습니다</p>
        <button onClick={() => navigate('/blog')} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #c8d0dc', background: '#fff', color: '#52525b', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          목록으로
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff' }}>
      <div className="md:max-w-[720px] md:mx-auto" style={{ padding: '0 18px' }}>

        {/* 뒤로 */}
        <button
          onClick={() => navigate('/blog')}
          style={{ display: 'block', margin: '16px 0 0', background: 'none', border: 'none', color: '#71717a', fontSize: 14, fontWeight: 600, padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ← 블로그 목록
        </button>

        {/* 태그 + 제목 + 메타 */}
        <div style={{ padding: '14px 0 8px' }}>
          <span style={{ display: 'inline-block', background: '#dbeafe', color: '#2563eb', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>
            #{post.tag}
          </span>
          <div style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.35, letterSpacing: '-0.03em', marginTop: 13, color: '#18181b' }}>
            {post.title}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 13, fontSize: 13, color: '#a1a1aa', fontWeight: 500 }}>
            <span>인코딩플러스+</span><span>·</span><span>{post.date}</span><span>·</span><span>조회수 {post.views ?? 0}</span>
          </div>
        </div>

        {/* 대표 이미지 */}
        {post.coverImage && (
          <div style={{ padding: '6px 0' }}>
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ display: 'block', width: '100%', height: 210, objectFit: 'cover', borderRadius: 14, background: '#f0f1f4' }}
            />
          </div>
        )}

        {/* 본문 */}
        <div className="md-preview" style={{ padding: '18px 0' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{typeof post.content === 'string' ? post.content : ''}</ReactMarkdown>

          {/* 하단 CTA — redesign 기준 */}
          <div style={{ background: '#fafafb', border: '1px solid #d4d9e0', borderRadius: 16, padding: '22px', marginTop: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#18181b' }}>우리 아이 입시가 고민되시나요?</div>
            <div style={{ fontSize: 13, color: '#71717a', marginTop: 6 }}>1:1 입시 상담 010-2838-2391</div>
            <button
              onClick={() => navigate('/apply')}
              className="hover-btn"
              style={{ marginTop: 15, background: '#2563eb', border: 'none', color: '#fff', borderRadius: 10, padding: '13px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              수강 신청하기
            </button>
          </div>

          {/* 모바일 BottomNav 여백 */}
          <div className="md:hidden" style={{ height: 'calc(80px + env(safe-area-inset-bottom, 0px))' }} />
        </div>
      </div>
    </div>
  )
}
