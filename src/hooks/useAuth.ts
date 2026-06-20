const STORAGE_KEY = 'admin_auth'

export function useAuth() {
  const isAuthenticated = (): boolean => {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  }

  const login = (password: string): boolean => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, 'true')
      return true
    }
    return false
  }

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isAuthenticated, login, logout }
}
