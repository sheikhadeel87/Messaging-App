import React, { useState } from 'react'
import GenderCheckBox from './GenderCheckBox'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signupThunk } from '../../redux/slices/authSlice'

function Signup() {
  const [input, setInput] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  })

  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleChange = (field, value) => {
    setInput({ ...input, [field]: value })
    setErrors({ ...errors, [field]: '' }) // clear error on change
  }

  const handleCheckboxChange = (gender) => {
    setInput({ ...input, gender })
    setErrors({ ...errors, gender: '' })
  }

  const validate = () => {
    const newErrors = {}

    if (!input.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!input.username.trim()) newErrors.username = 'Username is required'

    if (!input.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!input.password) {
      newErrors.password = 'Password is required'
    } else if (input.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!input.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
    } else if (input.password !== input.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!input.gender) newErrors.gender = 'Please select gender'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      Object.values(validationErrors).forEach(errMsg => toast.error(errMsg))
      return
    }

    try {
      const resultAction = await dispatch(signupThunk(input))
      
      if (signupThunk.fulfilled.match(resultAction)) {
        toast.success('Signup successful!')
        navigate('/')
      } else {
        const errorMessage = resultAction.payload?.message || 'Signup failed'
        toast.error(errorMessage)
        setErrors({ submit: errorMessage })
      }
    } catch (err) {
      console.error('Signup error:', err)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen min-width-96 mx-auto">
      <form className="form-control" onSubmit={handleSubmit}>
        <div className="fieldset bg-base-100 border-base-150 rounded-box w-xs border p-4">
          <h1 className="text-2xl font-bold text-gray-700 text-center">
            SignUp Talkify
          </h1>

          {/* Full Name */}
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input"
            placeholder="Full Name"
            value={input.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

          {/* Username */}
          <label className="label">Username</label>
          <input
            type="text"
            className="input"
            placeholder="Username"
            value={input.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          {/* Email */}
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="Email"
            value={input.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Password */}
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={input.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/* Confirm Password */}
          <label className="label">Confirm Password</label>
          <input
            type="password"
            className="input"
            placeholder="Confirm Password"
            value={input.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          {/* Gender */}
          <GenderCheckBox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={input.gender}
          />
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-gray-700 mt-2"
          >
            Already have an account? Login
          </Link>

          {/* Submit */}
          <button
            className="btn btn-neutral mt-4"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'SignUp'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Signup
