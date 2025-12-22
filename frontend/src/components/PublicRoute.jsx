import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PublicRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (user) {
    // User is already authenticated, redirect to home
    return <Navigate to="/" replace />
  }

  // User is not authenticated, render the login/signup page
  return children
}

export default PublicRoute

