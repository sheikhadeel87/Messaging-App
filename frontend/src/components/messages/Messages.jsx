import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Message from './Message'

function Messages() {
    const { messages, loading } = useSelector((state) => state.chat)
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    if (loading) {
        return (
            <div className='px-4 flex-1 overflow-y-auto flex items-center justify-center'>
                <span className='loading loading-spinner loading-lg'></span>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className='px-4 flex-1 overflow-y-auto flex items-center justify-center'>
                <p className='text-gray-500'>No messages yet. Start the conversation!</p>
            </div>
        )
    }

    return (
        <div className='px-4 flex-1 overflow-y-auto'>
            {messages.map((message) => (
                <Message key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages