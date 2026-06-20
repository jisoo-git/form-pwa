import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) navigate('/admin/dashboard', { replace: true })
  }, [])

  if (isAuthenticated()) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">관리자 로그인</h1>
        <p className="text-sm text-gray-400 text-center mb-8">학원 폼 관리 시스템</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500 text-center">비밀번호가 올바르지 않습니다.</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}
