import { useNavigate } from 'react-router-dom'
import { useForms } from '../../hooks/useForms'

const TYPE_LABEL: Record<string, string> = {
  enrollment: '수강신청',
  quiz: '퀴즈',
}

export default function AdminFormList() {
  const navigate = useNavigate()
  const { forms, loading, deleteForm, updateForm } = useForms()

  async function handleDelete(id: string | undefined, title: string) {
    if (!id) return
    if (!confirm(`"${title}" 폼을 삭제할까요?`)) return
    try {
      await deleteForm(id)
    } catch (e) {
      alert('삭제 실패: ' + (e as Error).message)
    }
  }

  async function handleToggleActive(id: string | undefined, isActive: boolean) {
    if (!id) return
    try {
      await updateForm(id, { isActive: !isActive })
    } catch (e) {
      alert('변경 실패: ' + (e as Error).message)
    }
  }

  return (
    <div style={{ padding: '24px 18px 40px' }} className="md:max-w-[1100px] md:mx-auto">

      {/* 헤더 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ width: 28, height: 3, background: '#2563eb', borderRadius: 999, marginBottom: 10 }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', letterSpacing: '0.06em' }}>FORM</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#18181b', marginTop: 2 }}>폼 편집</div>
          </div>
          <button
            onClick={() => navigate('/admin/builder/new')}
            style={{
              background: '#2563eb', border: 'none', color: '#fff',
              fontSize: 14, fontWeight: 700, padding: '10px 18px',
              borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            + 새 폼 만들기
          </button>
        </div>
      </div>

      {/* 안내 배너 */}
      <div style={{ marginBottom: 16, padding: '11px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, fontSize: 13, color: '#1d4ed8', fontWeight: 500 }}>
        활성화된 폼만 수강신청 페이지에 표시됩니다. 폼 하나를 활성화하면 나머지는 자동 비활성화됩니다.
      </div>

      {/* 폼 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#8c959f', fontSize: 14 }}>불러오는 중...</div>
        ) : forms.length === 0 ? (
          <div style={{ padding: '72px 0', textAlign: 'center', color: '#8c959f', fontSize: 14 }}>
            <div style={{ marginBottom: 12 }}>폼이 없습니다</div>
            <button
              onClick={() => navigate('/admin/builder/new')}
              style={{ background: '#2563eb', border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, padding: '10px 20px', borderRadius: 10, cursor: 'pointer' }}
            >
              + 첫 폼 만들기
            </button>
          </div>
        ) : forms.map(form => {
          const totalQ = form.sections.reduce((acc, s) => acc + s.questions.length, 0)
          return (
            <div
              key={form.id}
              style={{
                background: '#fff',
                border: `1px solid ${form.isActive ? '#86efac' : '#c8d0dc'}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              {/* 활성 토글 */}
              <button
                onClick={() => handleToggleActive(form.id, form.isActive)}
                title={form.isActive ? '비활성화' : '활성화'}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}
              >
                <div style={{
                  position: 'relative', width: 44, height: 24, borderRadius: 999,
                  background: form.isActive ? '#22c55e' : '#d4d4d8',
                  transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 4, left: form.isActive ? 24 : 4,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </div>
              </button>

              {/* 폼 정보 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#18181b' }}>{form.title || '(제목 없음)'}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 5 }}>
                    {TYPE_LABEL[form.type] ?? form.type}
                  </span>
                  {form.isActive && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 5 }}>
                      활성화됨
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#8c959f' }}>
                  섹션 {form.sections.length}개 · 질문 {totalQ}개
                </div>
              </div>

              {/* 수정 / 삭제 */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/admin/builder/${form.id}`)}
                  style={{
                    background: '#f4f4f6', border: 'none', color: '#52525b',
                    fontSize: 13, fontWeight: 700, padding: '9px 16px',
                    borderRadius: 8, cursor: 'pointer',
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(form.id, form.title)}
                  style={{
                    background: '#fff', border: '1px solid #fee2e2', color: '#ef4444',
                    fontSize: 13, fontWeight: 700, padding: '9px 16px',
                    borderRadius: 8, cursor: 'pointer',
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
