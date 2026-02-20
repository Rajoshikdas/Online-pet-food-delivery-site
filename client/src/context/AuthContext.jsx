import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token,   setToken]   = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!token) return
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => logout())
  }, [])

  const login = async (email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token); setUser(data.user)
      return data.user
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg); throw new Error(msg)
    } finally { setLoading(false) }
  }

  const register = async (name, email, password) => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token); setUser(data.user)
      return data.user
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg); throw new Error(msg)
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null); setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)