import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  children: ReactNode
  title?: string
  backTo?: string
  actions?: ReactNode
}

export default function AdminLayout({ children, title, backTo, actions }: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {backTo && (
            <button onClick={() => navigate(backTo)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">
              ←
            </button>
          )}
          <h1 className="text-base font-semibold text-gray-800 flex-1 truncate">{title}</h1>
          {actions}
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 whitespace-nowrap">
            로그아웃
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
