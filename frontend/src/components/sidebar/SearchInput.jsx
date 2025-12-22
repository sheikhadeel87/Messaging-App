import React, { useState, useEffect, useRef } from 'react'
import { IoSearchSharp } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, fetchMessages } from '../../redux/slices/chatSlice'
import toast from 'react-hot-toast'

function SearchInput () {
  const [search, setSearch] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dispatch = useDispatch()
  const { users } = useSelector((state) => state.chat)
  const dropdownRef = useRef(null)

  // Filter users as user types
  useEffect(() => {
    if (search.trim().length >= 3) {
      const matches = users.filter((u) => 
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredUsers(matches)
      setShowDropdown(matches.length > 0)
    } else {
      setFilteredUsers([])
      setShowDropdown(false)
    }
  }, [search, users])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectUser = (user) => {
    dispatch(selectUser(user))
    dispatch(fetchMessages(user._id))
    setSearch('')
    setShowDropdown(false)
    toast.success(`Chat opened with ${user.fullName}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Prevent form submission, search is handled by typing
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <form className='flex items-center gap-2' onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder='Search users (min 3 chars)...' 
          className='input input-bordered rounded-full text-white w-full bg-slate-400' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type='button' className='btn btn-circle bg-sky-500 text-white hover:bg-sky-600'>
          <IoSearchSharp className='w-6 h-6 outline-none'/>
        </button>
      </form>

      {/* Dropdown with matching results */}
      {showDropdown && (
        <div className='absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200'>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className='flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors'
              onClick={() => handleSelectUser(user)}
            >
              <div className='avatar'>
                <div className='w-10 rounded-full'>
                  <img 
                    src={user.profilePic} 
                    alt={user.fullName}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=200`
                    }}
                  />
                </div>
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-800'>{user.fullName}</p>
                <p className='text-xs text-gray-500'>@{user.username}</p>
              </div>
              <span className='text-xl'>{user.gender === 'male' ? '👨' : '👩'}</span>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {search.trim().length >= 3 && filteredUsers.length === 0 && (
        <div className='absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg p-3 border border-gray-200'>
          <p className='text-center text-gray-500 text-sm'>No users found</p>
        </div>
      )}
    </div>
  )
}

export default SearchInput