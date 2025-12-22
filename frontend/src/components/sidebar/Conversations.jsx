import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Conversation from './Conversation'
import { fetchUsers } from '../../redux/slices/chatSlice'

function Conversations () {
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector((state) => state.chat)

  useEffect(() => {
    console.log('Fetching users...')
    dispatch(fetchUsers())
      .then(() => console.log('Users fetched successfully'))
      .catch((err) => console.error('Error fetching users:', err))
  }, [dispatch])

  console.log('Conversations render:', { loading, usersCount: users.length, error })

  if (loading) {
    return (
      <div className='py-2 flex flex-col items-center gap-2'>
        <span className='loading loading-spinner'></span>
        <p className='text-xs text-gray-500'>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-2 text-center'>
        <p className='text-red-500 text-sm'>{error}</p>
        <button 
          className='btn btn-sm btn-primary mt-2'
          onClick={() => dispatch(fetchUsers())}
        >
          Retry
        </button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className='py-2 text-center text-gray-500'>
        <p>No users found</p>
        <button 
          className='btn btn-sm btn-primary mt-2'
          onClick={() => dispatch(fetchUsers())}
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {users.map((user) => (
        <Conversation 
          key={user._id} 
          user={user}
          latestMessage={null}
        />
      ))}
    </div>
  )
}

export default Conversations