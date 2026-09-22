import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tunefault_token'))
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('tunefault_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('tunefault_token', newToken)
    localStorage.setItem('tunefault_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('tunefault_token')
    localStorage.removeItem('tunefault_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
