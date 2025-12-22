import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, fetchMessages } from '../../redux/slices/chatSlice'

function Conversation({ user, latestMessage }) {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector((state) => state.chat)
    const { user: authUser } = useSelector((state) => state.auth)
    const [imgError, setImgError] = useState(false)
    
    const isSelected = selectedUser?._id === user._id

    const handleSelectUser = () => {
        dispatch(selectUser(user))
        dispatch(fetchMessages(user._id))
    }

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now - date) / (1000 * 60 * 60)
        
        if (diffInHours < 24) {
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            return `${hours}:${minutes}`
        } else {
            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            return `${day}/${month}`
        }
    }

    // Truncate message
    const truncateMessage = (msg, maxLength = 30) => {
        if (!msg) return 'No messages yet'
        return msg.length > maxLength ? msg.substring(0, maxLength) + '...' : msg
    }

    // Fallback avatar
    const getAvatarUrl = () => {
        if (imgError || !user.profilePic) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&color=fff&size=200`
        }
        return user.profilePic
    }

    return (
        <>
        <div 
            className={`flex gap-2 items-center hover:bg-sky-500 p-2 py-1 cursor-pointer rounded-md transition-colors ${
                isSelected ? 'bg-sky-500' : ''
            }`}
            onClick={handleSelectUser}
        >
            <div className='avatar-relative relative'>
                <div className='w-12 rounded-full overflow-hidden'>
                    <img 
                        src={getAvatarUrl()}
                        alt={user.fullName}
                        onError={() => setImgError(true)}
                    />
                </div>
                {/* Online indicator - you can add online status logic later */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className='flex flex-col flex-1 min-w-0'>
                <div className='flex gap-3 justify-between items-start'>
                  <div className='flex-1 min-w-0'>
                    <p className={`font-bold truncate ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {user.fullName}
                    </p>
                    {latestMessage && (
                      <p className={`text-xs truncate ${isSelected ? 'text-gray-100' : 'text-gray-500'}`}>
                        {latestMessage.senderId === authUser?._id ? 'You: ' : ''}
                        {truncateMessage(latestMessage.message)}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <span className='text-xl'>{user.gender === 'male' ? '👨' : '👩'}</span>
                    {latestMessage && (
                      <span className={`text-xs ${isSelected ? 'text-gray-100' : 'text-gray-500'}`}>
                        {formatTime(latestMessage.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
            </div>
        </div>
        <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default Conversation