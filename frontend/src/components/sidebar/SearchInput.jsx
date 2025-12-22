import React, { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, fetchMessages } from '../../redux/slices/chatSlice'
import toast from 'react-hot-toast'

function SearchInput () {
  const [search, setSearch] = useState('')
  const dispatch = useDispatch()
  const { conversations } = useSelector((state) => state.chat)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!search.trim()) {
      return
    }

    // Search in conversations
    const conversation = conversations.find((conv) => 
      conv.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      conv.user.username.toLowerCase().includes(search.toLowerCase())
    )

    if (conversation) {
      dispatch(selectUser(conversation.user))
      dispatch(fetchMessages(conversation.user._id))
      setSearch('')
    } else {
      toast.error('User not found in your conversations')
    }
  }

  return (
    <>
    <form className='flex items-center gap-2' onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder='Search' 
          className='input input-bordered rounded-full text-gray-400' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type='submit' className='btn btn-circle bg-sky-500 text-white hover:bg-sky-600'>
          <IoSearchSharp className='w-6 h-6 outline-none'/>
        </button>
    </form>
    </>
  )
}

export default SearchInput