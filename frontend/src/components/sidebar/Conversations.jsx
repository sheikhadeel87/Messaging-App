import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Conversation from './Conversation'
import { fetchConversations, fetchUsers, clearError } from '../../redux/slices/chatSlice'

function Conversations () {
  const dispatch = useDispatch()
  const { conversations, users, loading, error } = useSelector((state) => state.chat)

  useEffect(() => {
    console.log('Fetching conversations...')
    dispatch(clearError()) // Clear any previous errors
    
    // Fetch conversations (users with messages)
    dispatch(fetchConversations())
      .then(() => console.log('Conversations fetched successfully'))
      .catch((err) => {
        console.error('Error fetching conversations:', err)
      })
  }, [dispatch])

  console.log('Conversations render:', { 
    loading, 
    conversationsCount: conversations.length, 
    usersCount: users.length, 
    error 
  })

  if (loading) {
    return (
      <div className='py-2 flex flex-col items-center gap-2'>
        <span className='loading loading-spinner'></span>
        <p className='text-xs text-gray-500'>Loading conversations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-2 text-center'>
        <p className='text-red-500 text-sm'>{error}</p>
        <button 
          className='btn btn-sm btn-primary mt-2'
          onClick={() => dispatch(fetchConversations())}
        >
          Retry
        </button>
      </div>
    )
  }

  // Show conversations if available, otherwise show all users
  const displayList = conversations.length > 0 ? conversations : users.map(u => ({ user: u, latestMessage: null }))

  if (displayList.length === 0) {
    return (
      <div className='py-2 text-center text-gray-500'>
        <p>No conversations yet</p>
        <p className='text-xs mt-1'>Start chatting with someone!</p>
        <button 
          className='btn btn-sm btn-primary mt-2'
          onClick={() => dispatch(fetchUsers())}
        >
          Show All Users
        </button>
      </div>
    )
  }

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {displayList.map((item) => (
        <Conversation 
          key={item.user._id} 
          user={item.user}
          latestMessage={item.latestMessage}
        />
      ))}
    </div>
  )
}

export default Conversations