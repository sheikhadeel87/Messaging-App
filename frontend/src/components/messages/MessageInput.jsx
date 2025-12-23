import React, { useState, useEffect } from 'react'
import { BsSend } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '../../redux/slices/chatSlice'
import { socket } from '../../socket'
import toast from 'react-hot-toast'

function MessageInput() {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const dispatch = useDispatch()
    const { selectedUser } = useSelector((state) => state.chat)

    useEffect(() => {
        // Listen for message confirmation
        socket.on('messageSent', (sentMessage) => {
            dispatch(addMessage(sentMessage))
            setSending(false)
        })

        socket.on('error', () => {
            toast.error('Failed to send message')
            setSending(false)
        })

        return () => {
            socket.off('messageSent')
            socket.off('error')
        }
    }, [dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        if (!selectedUser) {
            toast.error('Please select a user to send message')
            return
        }

        setSending(true)
        socket.emit('sendMessage', {
            receiverId: selectedUser._id,
            message: message.trim()
        })
        setMessage('')
    }

    return (
        <form className='px-4 my-3' onSubmit={handleSubmit}>
          <div className='w-full relative'>
            <input 
                type="text" 
                placeholder='Send a Message' 
                className='border text-sm rounded-lg block w-full p-2.5 bg-gray-500 border-gray-600 text-white' 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
            />
            <button 
                type='submit' 
                className='absolute inset-y-0 end-0 flex items-center pe-3'
                disabled={sending}
            >
                {sending ? (
                    <span className='loading loading-spinner loading-sm'></span>
                ) : (
                    <BsSend />
                )}
            </button>
          </div>
        </form>
    )
}

export default MessageInput
