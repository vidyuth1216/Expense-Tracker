import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-[#84908a]">Loading your workspace...</div>
  if (!user) return <Navigate replace state={{ from: location }} to="/login" />
  return <Outlet />
}