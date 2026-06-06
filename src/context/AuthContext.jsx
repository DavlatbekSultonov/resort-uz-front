import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then(res => setAdmin(res.data.data))
        .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('admin') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('admin', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  const logoutAdmin = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
