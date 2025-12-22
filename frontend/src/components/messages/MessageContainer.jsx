import React from 'react'
import { useSelector } from 'react-redux'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { TiMessages } from 'react-icons/ti'

function MessageContainer() {
    const { selectedUser } = useSelector((state) => state.chat)
    const { user: authUser } = useSelector((state) => state.auth)
    
    return (
        <div className='flex flex-col justify-center h-full w-full bg-blue-100'>
            {!selectedUser ? (
                <NoChatSelected authUser={authUser} />
            ) : (
                <>  
                    <div className='bg-slate-400 px-4 py-2 mb-2'>
                        <span className='label-text'>To: </span>{" "}
                        <span className='text-gray-900 font-bold'>{selectedUser.fullName}</span>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    )
}

export default MessageContainer

function NoChatSelected({ authUser }) {
    return (
        <div className='flex flex-col justify-center h-full w-full'>
            <div className='px-4 text-center text-gray-400 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser?.fullName || 'User'} 𒂒</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    )
}