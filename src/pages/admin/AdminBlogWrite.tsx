import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { db } from '../../firebase/config'
import type { Post } from '../../types'
import { FALLBACK_POSTS } from '../Blog'

const COMMON_TAGS = ['특별전형', '일반전형', '소질적성', '면접', '실적물', '자소서', '합격후기', '특성화고']

function Field({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#52525b', marginBottom: sub ? 3 : 10 }}>
        {label}
        {sub && <span style={{ fontWeight: 400, color: '#8c959f', marginLeft: 6 }}>{sub}</span>}
      </div>
      {children}
    </div>
  )
}

export default function AdminBlogWrite() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [tag, setTag] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [currentPublished, setCurrentPublished] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (!isEdit) return
    async function loadPost() {
      try {
        const snap = await getDoc(doc(db, 'blogPosts', id as string))
        const post: Post = snap.exists()
          ? { id: snap.id, ...(snap.data() as Omit<Post, 'id'>) }
          : FALLBACK_POSTS.find(p => p.id === id) || FALLBACK_POSTS[0]
        setTag(post.tag)
        setTitle(post.title)
        setExcerpt(post.excerpt)
        setCoverImage(post.coverImage)
        setMarkdown(typeof post.content === 'string' ? post.content : '')
        setCurrentPublished(post.published)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [id, isEdit])

  function estimateRead() {
    const mins = Math.max(1, Math.round(markdown.length / 500))
    return `${mins}분`
  }

  function buildPayload(published: boolean) {
    const today = new Date().toISOString().slice(0, 10)
    return {
      tag: tag.trim(), title: title.trim(), excerpt: excerpt.trim(),
      coverImage: coverImage.trim(), content: markdown,
      ...(isEdit ? {} : { date: today }),
      read: estimateRead(),
      published,
      updatedAt: serverTimestamp(),
    }
  }

  async function handleSaveDraft() {
    if (!tag.trim()) return alert('태그를 입력해주세요.')
    if (!title.trim()) return alert('제목을 입력해주세요.')
    setSavingDraft(true)
    try {
      const payload = buildPayload(false)
      if (isEdit) {
        await updateDoc(doc(db, 'blogPosts', id as string), payload)
      } else {
        await addDoc(collection(db, 'blogPosts'), { ...payload, createdAt: serverTimestamp() })
      }
      navigate('/admin/blog')
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message)
    } finally {
      setSavingDraft(false)
    }
  }

  async function handlePublish() {
    if (!tag.trim()) return alert('태그를 입력해주세요.')
    if (!title.trim()) return alert('제목을 입력해주세요.')
    if (!excerpt.trim()) return alert('요약을 입력해주세요.')
    if (!markdown.trim()) return alert('본문을 입력해주세요.')
    setSaving(true)
    try {
      const payload = buildPayload(true)
      if (isEdit) {
        await updateDoc(doc(db, 'blogPosts', id as string), payload)
      } else {
        await addDoc(collection(db, 'blogPosts'), { ...payload, createdAt: serverTimestamp() })
      }
      navigate('/admin/blog')
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveEdit() {
    if (!tag.trim()) return alert('태그를 입력해주세요.')
    if (!title.trim()) return alert('제목을 입력해주세요.')
    setSaving(true)
    try {
      const payload = buildPayload(currentPublished ?? true)
      await updateDoc(doc(db, 'blogPosts', id as string), payload)
      navigate('/admin/blog')
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const isDraft = isEdit && currentPublished === false

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, color: '#8c959f', fontSize: 14 }}>불러오는 중...</div>
  )

  return (
    <div style={{ padding: '0 0 60px' }} className="md:max-w-[1100px] md:mx-auto">

      {/* 헤더 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #c8d0dc',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <button
            onClick={() => navigate('/admin/blog')}
            style={{ background: 'none', border: 'none', color: '#8c959f', fontSize: 12, fontWeight: 600, padding: '0 0 4px', cursor: 'pointer' }}
          >
            ← 블로그 목록
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#18181b' }}>{isEdit ? '글 수정' : '새 글 작성'}</span>
            {isEdit && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: isDraft ? '#f4f4f6' : '#dcfce7',
                color: isDraft ? '#71717a' : '#15803d',
              }}>
                {isDraft ? '초안' : '발행됨'}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/admin/blog')}
            style={{ background: '#f4f4f6', border: 'none', color: '#52525b', fontSize: 13, fontWeight: 600, padding: '9px 14px', borderRadius: 10, cursor: 'pointer' }}
          >
            취소
          </button>
          {(!isEdit || isDraft) && (
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft}
              style={{ background: '#f4f4f6', border: 'none', color: '#52525b', fontSize: 13, fontWeight: 600, padding: '9px 14px', borderRadius: 10, cursor: savingDraft ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {savingDraft ? '저장 중...' : '초안 저장'}
            </button>
          )}
          {isEdit && !isDraft ? (
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              style={{ background: saving ? '#93c5fd' : '#2563eb', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '9px 18px', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={saving}
              style={{ background: saving ? '#93c5fd' : '#2563eb', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '9px 18px', borderRadius: 10, cursor: saving ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              {saving ? '저장 중...' : '발행하기'}
            </button>
          )}
        </div>
      </div>

      {/* 폼 필드들 */}
      <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* 해시태그 */}
        <Field label="해시태그" sub="(1개)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {COMMON_TAGS.map(t => (
              <button
                key={t}
                onClick={() => setTag(t)}
                style={{
                  padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  border: tag === t ? '2px solid #2563eb' : '1px solid #c8d0dc',
                  background: tag === t ? '#dbeafe' : '#f4f4f6',
                  color: tag === t ? '#1d4ed8' : '#52525b',
                  cursor: 'pointer',
                }}
              >
                #{t}
              </button>
            ))}
          </div>
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="직접 입력..."
            style={{ width: '100%', border: '1px solid #c8d0dc', borderRadius: 8, padding: '9px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#2563eb' }}
            onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
          />
        </Field>

        {/* 제목 */}
        <Field label="제목">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="글 제목을 입력하세요"
            style={{ width: '100%', border: '1px solid #c8d0dc', borderRadius: 8, padding: '10px 12px', fontSize: 16, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#2563eb' }}
            onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
          />
        </Field>

        {/* 요약 */}
        <Field label="요약" sub="(목록 카드에 보이는 설명)">
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="글의 핵심 내용을 2~3문장으로 요약하세요"
            rows={2}
            style={{ width: '100%', border: '1px solid #c8d0dc', borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
            onFocus={e => { e.target.style.borderColor = '#2563eb' }}
            onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
          />
        </Field>

        {/* 대표 이미지 */}
        <Field label="대표 이미지 URL">
          <input
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            placeholder="https://..."
            style={{ width: '100%', border: '1px solid #c8d0dc', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#2563eb' }}
            onBlur={e => { e.target.style.borderColor = '#c8d0dc' }}
          />
          {coverImage && (
            <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', height: 120, background: '#f0f1f4' }}>
              <img src={coverImage} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </Field>

        {/* 마크다운 에디터 */}
        <div style={{ background: '#fff', border: '1px solid #c8d0dc', borderRadius: 12, overflow: 'hidden' }}>
          {/* 탭 + 치트시트 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid #c8d0dc', background: '#f9fafb' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              <button
                onClick={() => setPreview(false)}
                style={{
                  padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: !preview ? '#2563eb' : 'none',
                  color: !preview ? '#fff' : '#71717a',
                }}
              >
                편집
              </button>
              <button
                onClick={() => setPreview(true)}
                style={{
                  padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: preview ? '#2563eb' : 'none',
                  color: preview ? '#fff' : '#71717a',
                }}
              >
                미리보기
              </button>
            </div>
            <div style={{ fontSize: 11, color: '#a1a1aa', fontWeight: 500 }}>
              <span style={{ marginRight: 8 }}><b>**굵게**</b></span>
              <span style={{ marginRight: 8 }}><i>*기울임*</i></span>
              <span style={{ marginRight: 8 }}>## 제목</span>
              <span>![설명](url)</span>
            </div>
          </div>

          {/* 편집 */}
          {!preview && (
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              placeholder={`본문을 마크다운으로 작성하세요.\n\n## 소제목\n\n단락 내용을 여기에 씁니다.\n\n**굵은 글씨**, *기울임*\n\n![이미지 설명](https://이미지URL)`}
              style={{
                width: '100%', minHeight: 400, border: 'none',
                padding: '16px 18px', fontSize: 14, lineHeight: 1.8,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                color: '#3f3f46', fontFamily: 'monospace',
              }}
            />
          )}

          {/* 미리보기 */}
          {preview && (
            <div className="md-preview" style={{ padding: '16px 18px', minHeight: 400 }}>
              {markdown.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              ) : (
                <p style={{ color: '#a1a1aa', fontSize: 14 }}>본문을 입력하면 여기에 미리보기가 표시됩니다.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
