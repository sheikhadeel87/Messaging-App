import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../../redux/slices/authSlice'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleSubmit = async(e) => {
    e.preventDefault()

    // reset errors
    setEmailError('')
    setPasswordError('')

    let hasError = false

    // email validation
    if (!email) {
      setEmailError('Email is required')
      toast.error('Email is required')
      hasError = true
    }

    // password validation (min 6)
    if (!password) {
      setPasswordError('Password is required')
      toast.error('Password is required')
      hasError = true
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      toast.error('Password must be at least 6 characters')
      hasError = true
    }

    if (hasError) return

    // Dispatch login thunk
    try {
      const resultAction = await dispatch(loginThunk({ email, password }))
      
      if (loginThunk.fulfilled.match(resultAction)) {
        toast.success('Login successful!')
        navigate('/')
      } else {
        const errorMsg = resultAction.payload?.message || 'Login failed'
        toast.error(errorMsg)
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen min-width-96 mx-auto">
      <form className="form-control" onSubmit={handleSubmit}>
        <div className="fieldset bg-base-100 border-base-150 rounded-box w-xs border p-4">
          <h1 className="text-2xl font-bold text-gray-700 text-center">
            Login Talkify
          </h1>

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
          />
          {emailError && (
            <p className="text-sm text-red-500 mt-1">{emailError}</p>
          )}

          {/* Password */}
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}

          <Link
            to="/signup"
            className="text-sm text-gray-500 hover:text-gray-700 mt-2"
          >
            Don't have an account? Signup
          </Link>

          <button
            className="btn btn-neutral mt-4"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
