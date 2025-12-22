import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />
  }

  // User is authenticated, render the protected component
  return children
}

export default ProtectedRoute

