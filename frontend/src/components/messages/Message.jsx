import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMessageThunk, editMessageThunk } from '../../redux/slices/chatSlice'
import toast from 'react-hot-toast'
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md'

function Message({ message }) {
    const { user: authUser } = useSelector((state) => state.auth)
    const { selectedUser } = useSelector((state) => state.chat)
    const dispatch = useDispatch()
    
    const [imgError, setImgError] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editedText, setEditedText] = useState(message.message)
    const [showActions, setShowActions] = useState(false)
    
    const isMyMessage = message.senderId === authUser?._id
    const chatAlign = isMyMessage ? 'chat-end' : 'chat-start'
    const bubbleBg = isMyMessage ? 'bg-blue-400' : 'bg-gray-400'
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

    // Handle delete
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await dispatch(deleteMessageThunk(message._id)).unwrap()
                toast.success('Message deleted')
            } catch (err) {
                toast.error(err.error || 'Failed to delete message')
            }
        }
    }

    // Handle edit save
    const handleEditSave = async () => {
        if (!editedText.trim()) {
            toast.error('Message cannot be empty')
            return
        }
        
        if (editedText.trim() === message.message) {
            setIsEditing(false)
            return
        }

        try {
            await dispatch(editMessageThunk({ 
                messageId: message._id, 
                message: editedText.trim() 
            })).unwrap()
            setIsEditing(false)
            toast.success('Message updated')
        } catch (err) {
            toast.error(err.error || 'Failed to edit message')
        }
    }

    // Handle edit cancel
    const handleEditCancel = () => {
        setEditedText(message.message)
        setIsEditing(false)
    }

    return (
        <div 
            className={`chat ${chatAlign} group relative`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt="User avatar"
                        src={getProfilePic()}
                        onError={() => setImgError(true)}
                    />
                </div>
            </div>

            <div className={`chat-bubble ${textColor} ${bubbleBg} relative`}>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            className="textarea textarea-sm bg-white/20 text-white resize-none"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows={2}
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <button 
                                className="btn btn-xs btn-success"
                                onClick={handleEditSave}
                            >
                                <MdCheck />
                            </button>
                            <button 
                                className="btn btn-xs btn-error"
                                onClick={handleEditCancel}
                            >
                                <MdClose />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {message.message}
                        {message.edited && (
                            <span className="text-xs opacity-70 ml-2">(edited)</span>
                        )}
                    </>
                )}
                
                {/* Action buttons - only show for own messages */}
                {isMyMessage && !isEditing && showActions && (
                    <div className="absolute -top-8 right-0 flex gap-1 bg-gray-800 rounded-lg p-1 shadow-lg">
                        <button
                            className="btn btn-xs btn-ghost text-white hover:bg-white/20"
                            onClick={() => setIsEditing(true)}
                            title="Edit message"
                        >
                            <MdEdit size={16} />
                        </button>
                        <button
                            className="btn btn-xs btn-ghost text-white hover:bg-red-500"
                            onClick={handleDelete}
                            title="Delete message"
                        >
                            <MdDelete size={16} />
                        </button>
                    </div>
                )}
            </div>
            
            <div className="chat-footer opacity-50 text-gray-900 text-xs">
                {message.createdAt ? formatTime(message.createdAt) : 'Now'}
            </div>
        </div>
    )
}

export default Message
