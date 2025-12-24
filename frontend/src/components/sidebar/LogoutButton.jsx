import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import axios from 'axios'
import { logoutUser } from '../../api/authApi'

function LogoutButton () {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logoutUser()
      
      // Dispatch Redux logout action
      dispatch(logout())
      toast.success('Logged out successfully')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className='mb-auto'>
        <BiLogOut 
          className='w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600' 
          onClick={handleLogout}
        />
    </div>
  )
}

export default LogoutButton