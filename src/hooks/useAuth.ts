const STORAGE_KEY = 'admin_auth'
const CORRECT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string

export function useAuth() {
  const isAuthenticated = (): boolean => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  }

  const login = (password: string): boolean => {
    if (password !== CORRECT_PASSWORD) return false
    localStorage.setItem(STORAGE_KEY, 'true')
    return true
  }

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isAuthenticated, login, logout }
}
