const API_BASE = import.meta.env.VITE_API_BASE_URL || 
                 (window.location.hostname === 'localhost' 
                   ? 'http://localhost:5002' 
                   : 'https://catalina-pentasyllabic-hye.ngrok-free.dev');
import React, { useState, useEffect } from 'react'
import { BsSend } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../../redux/slices/chatSlice'
// import { socket } from '../../socket'
import { sendMessage as sendMessageAPI } from '../../api/messageApi'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'


function MessageInput() {
    const [message, setMessage] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [sending, setSending] = useState(false)
    const dispatch = useDispatch()
    const { selectedUser } = useSelector((state) => state.chat)

    // useEffect(() => {
    //     // Listen for message confirmation
    //     socket.on('messageSent', (sentMessage) => {
    //         dispatch(addMessage(sentMessage))
    //         setSending(false)
    //     })

    //     socket.on('error', () => {
    //         toast.error('Failed to send message')
    //         setSending(false)
    //     })

    //     return () => {
    //         socket.off('messageSent')
    //         socket.off('error')
    //     }
    // }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Allow submission if either message or image exists
        if (!message.trim() && !imageUrl) {
            toast.error('Please enter a message or select an image')
            return
        }

        if (!selectedUser) {
            toast.error('Please select a user to send message')
            return
        }

        setSending(true)
        // USING REST API INSTEAD OF SOCKET.IO
        try {
            const sentMessage = await sendMessageAPI(selectedUser._id, {
                message: message.trim(),
                imageUrl: imageUrl || null
            })
            
            // Add the sent message to Redux store
            dispatch(addMessage(sentMessage))
            toast.success('Message sent!')
            
            // Clear inputs
            setMessage('')
            setImageUrl(null)
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error(error.response?.data?.error || 'Failed to send message')
        } finally {
            setSending(false)
        }
        // ORIGINAL SOCKET CODE - DISABLED
        // setSending(true)
        // socket.emit('sendMessage', {
        //     receiverId: selectedUser._id,
        //     message: message.trim(),
        //     imageUrl: imageUrl || null  // Include image URL
        // })
        // setMessage('')
        // setImageUrl(null)  // Clear image after sending
    }

    const handleImageUploaded = (url) => {
        setImageUrl(url)
        toast.success('Image ready to send!')
    }

    const handleCancelImage = () => {
        setImageUrl(null)
    }

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-2'>
            {/* Show image preview if uploaded */}
            {imageUrl && (
                <div className='flex items-center gap-2 bg-gray-700 p-2 rounded-lg'>
                    <img 
                        src="https://via.placeholder.com/150"
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded" 
                    />
                    <span className='text-white text-sm flex-1'>Image ready to send</span>
                    <button
                        type="button"
                        onClick={handleCancelImage}
                        className='btn btn-sm btn-ghost text-white'
                    >
                        ✕
                    </button>
                </div>
            )}
            
            {/* Input row with image upload and send button */}
            <div className='w-full relative flex items-center gap-2'>
                <ImageUpload 
                    onImageUploaded={handleImageUploaded}
                    disabled={sending}
                />
                
                <input 
                    type="text" 
                    placeholder='Send a Message or Image' 
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-500 border-gray-600 text-white' 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={sending}
                />
                
                <button 
                    type='submit' 
                    className='btn btn-circle bg-sky-500 text-white hover:bg-sky-600'
                    disabled={sending}
                >
                    {sending ? (
                        <span className='loading loading-spinner loading-sm'></span>
                    ) : (
                        <BsSend />
                    )}
                </button>
            </div>
          </div>
        </form>
    )
}

export default MessageInput