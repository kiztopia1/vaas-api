import { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

// Create Auth Context
export const AuthContext = createContext(null)

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get token from cookies
    const token = Cookies.get('auth_token')

    if (token) {
      fetchUser(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(res)
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        logout() // Token is invalid, logout user
      }
    } catch (error) {
      console.error('Auth error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = (token) => {
    Cookies.set('auth_token', token, { expires: 7 })
    fetchUser(token)
    navigate('/dashboard')
  }

  const logout = () => {
    Cookies.remove('auth_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
