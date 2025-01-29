import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
