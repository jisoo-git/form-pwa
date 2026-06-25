import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import type { Post } from '../../types'
import { FALLBACK_POSTS } from '../Blog'

const MAX_PINNED = 3

export default function AdminBlogList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [fromFirestore, setFromFirestore] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'))
        const snap = await getDocs(q)
        if (snap.empty) {
          setPosts(FALLBACK_POSTS)
          setFromFirestore(false)
        } else {
          setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Post, 'id'>) })))
          setFromFirestore(true)
        }
      } catch {
        setPosts(FALLBACK_POSTS)
        setFromFirestore(false)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('이 글을 삭제할까요?')) return
    try {
      await deleteDoc(doc(db, 'blogPosts', id))
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      alert('삭제 실패: ' + (e as Error).message)
    }
  }

  async function handleTogglePin(post: Post) {
    const pinnedCount = posts.filter(p => p.pinned).length
    if (!post.pinned && pinnedCount >= MAX_PINNED) {
      alert(`고정 글은 최대 ${MAX_PINNED}개까지 설정할 수 있습니다.`)
      return
    }
    const newPinned = !post.pinned
    try {
      if (fromFirestore) {
        await updateDoc(doc(db, 'blogPosts', post.id), { pinned: newPinned })
      }
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned: newPinned } : p))
    } catch (e) {
      alert('고정 변경 실패: ' + (e as Error).message)
    }
  }

  async function handleTogglePublish(post: Post) {
    const newPublished = post.published === false ? true : false
    try {
      if (fromFirestore) {
        await updateDoc(doc(db, 'blogPosts', post.id), { published: newPublished })
      }
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newPublished } : p))
    } catch (e) {
      alert('변경 실패: ' + (e as Error).message)
    }
  }

  const pinnedCount = posts.filter(p => p.pinned).length

  return (
    <div style={{ padding: '24px 18px 32px' }} className="md:max-w-[1100px] md:mx-auto">

      {/* 헤더 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em' }}>BLOG</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#18181b', marginTop: 2 }}>
              블로그 관리
              {pinnedCount > 0 && (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', marginLeft: 10 }}>
                  📌 {pinnedCount}/{MAX_PINNED} 고정
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/blog/new')}
            style={{ background: '#2563eb', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '9px 16px', borderRadius: 10, cursor: 'pointer', flexShrink: 0 }}
          >
            + 새 글 작성
          </button>
        </div>
      </div>

      {!fromFirestore && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, fontSize: 12, color: '#92400e' }}>
          Firestore에 글이 없어 예시 데이터를 표시합니다. 새 글을 작성하면 실제 저장됩니다.
        </div>
      )}

      {/* 고정 안내 */}
      <div style={{ marginBottom: 16, padding: '9px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, fontSize: 12, color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>📌</span>
        <span>핀 버튼으로 최대 {MAX_PINNED}개 글을 사용자 블로그 상단에 고정할 수 있습니다.</span>
      </div>

      {/* 목록 */}
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#8c959f', fontSize: 14 }}>불러오는 중...</div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#8c959f', fontSize: 14 }}>글이 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 14 }}>
          {posts.map(post => {
            const isDraft = post.published === false
            return (
            <div
              key={post.id}
              style={{
                background: isDraft ? '#fafafa' : '#fff',
                border: post.pinned ? '2px solid #2563eb' : isDraft ? '1px dashed #c8d0dc' : '1px solid #c8d0dc',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* 대표 이미지 + 핀 토글 */}
              <div style={{ height: 150, flexShrink: 0, background: '#f0f1f4', overflow: 'hidden', position: 'relative' }}>
                {post.coverImage
                  ? <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isDraft ? 0.55 : 1 }} />
                  : isDraft && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 600 }}>초안</span>
                    </div>
                  )
                }
                {/* 초안 배지 */}
                {isDraft && (
                  <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                    초안
                  </div>
                )}
                {/* 핀 토글 — 이미지 우상단 */}
                <button
                  onClick={() => handleTogglePin(post)}
                  title={post.pinned ? '고정 해제' : '상단 고정'}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 2,
                    background: post.pinned ? '#2563eb' : 'rgba(255,255,255,0.22)',
                    border: post.pinned ? 'none' : '1px solid rgba(255,255,255,0.45)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: 8,
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, cursor: 'pointer',
                  }}
                >
                  📌
                </button>
              </div>

              {/* 콘텐츠 */}
              <div style={{ flex: 1, padding: '14px 16px 12px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 6, letterSpacing: '0.04em' }}>
                  #{post.tag}
                </div>
                <div style={{
                  fontSize: 15, fontWeight: 800, color: '#18181b', lineHeight: 1.4,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  marginBottom: 6,
                }}>
                  {post.title}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: '#71717a', lineHeight: 1.5,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {post.excerpt}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 12, color: '#a1a1aa' }}>
                  <span>{post.date}</span>
                  <span>조회수 {post.views ?? 0}</span>
                </div>
              </div>

              {/* 관리 버튼 */}
              <div style={{ display: 'flex', gap: 6, padding: '0 16px 14px' }}>
                <button
                  onClick={() => handleTogglePublish(post)}
                  style={{
                    flex: 1, border: 'none', fontSize: 13, fontWeight: 700, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                    background: isDraft ? '#2563eb' : '#f4f4f6',
                    color: isDraft ? '#fff' : '#52525b',
                  }}
                >
                  {isDraft ? '발행' : '비공개'}
                </button>
                <button
                  onClick={() => navigate(`/admin/blog/${post.id}`)}
                  style={{ flex: 1, background: '#f4f4f6', border: 'none', color: '#52525b', fontSize: 13, fontWeight: 700, padding: '8px 0', borderRadius: 8, cursor: 'pointer' }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{ flex: 1, background: '#fff', border: '1px solid #fee2e2', color: '#ef4444', fontSize: 13, fontWeight: 700, padding: '8px 0', borderRadius: 8, cursor: 'pointer' }}
                >
                  삭제
                </button>
              </div>
            </div>
          )
          })}

        </div>
      )}
    </div>
  )
}
