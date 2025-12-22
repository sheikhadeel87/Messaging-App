import React, { useState } from 'react'
import { BsSend } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { sendMessageThunk } from '../../redux/slices/chatSlice'
import toast from 'react-hot-toast'

function MessageInput() {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const { selectedUser, sendingMessage } = useSelector((state) => state.chat)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }

        if (!selectedUser) {
            toast.error('Please select a user to send message')
            return
        }

        try {
            const resultAction = await dispatch(sendMessageThunk({
                userId: selectedUser._id,
                message: message.trim()
            }))

            if (sendMessageThunk.fulfilled.match(resultAction)) {
                setMessage('') // Clear input after successful send
            } else {
                toast.error('Failed to send message')
            }
        } catch (err) {
            console.error('Send message error:', err)
            toast.error('Something went wrong')
        }
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
                disabled={sendingMessage}
            />
            <button 
                type='submit' 
                className='absolute inset-y-0 end-0 flex items-center pe-3'
                disabled={sendingMessage}
            >
                {sendingMessage ? (
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
