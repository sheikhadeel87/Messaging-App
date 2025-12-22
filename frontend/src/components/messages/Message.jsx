import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Message({ message }) {
    const { user: authUser } = useSelector((state) => state.auth)
    const { selectedUser } = useSelector((state) => state.chat)
    const [imgError, setImgError] = useState(false)
    
    const isMyMessage = message.senderId === authUser?._id
    const chatAlign = isMyMessage ? 'chat-end' : 'chat-start'
    const bubbleBg = isMyMessage ? 'bg-blue-500' : 'bg-gray-400'
    const textColor = 'text-white'

    // Get profile pic with fallback
    const getProfilePic = () => {
        const pic = isMyMessage ? authUser?.profilePic : selectedUser?.profilePic
        const name = isMyMessage ? authUser?.fullName : selectedUser?.fullName
        
        if (imgError || !pic) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=200`
        }
        return pic
    }

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    return (
        <div className={`chat ${chatAlign}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="User avatar"
                        src={getProfilePic()}
                        onError={() => setImgError(true)}
                    />
                </div>
            </div>

            <div className={`chat-bubble ${textColor} ${bubbleBg}`}>
                {message.message}
            </div>
            <div className="chat-footer opacity-50 text-gray-900 text-xs">
                {message.createdAt ? formatTime(message.createdAt) : 'Now'}
            </div>
        </div>
    )
}

export default Message
