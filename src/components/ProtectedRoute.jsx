import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
