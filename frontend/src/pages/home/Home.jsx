import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import MessageContainer from '../../components/messages/MessageContainer.jsx'
// import { socket } from '../../socket.js'
// import { addMessage } from '../../redux/slices/chatSlice.js'

function Home () {
  const { user } = useSelector((state) => state.auth)
  const { selectedUser } = useSelector((state) => state.chat)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   if (user?._id) {
  //     socket.connect()
      
  //     socket.on('receiveMessage', (message) => {
  //       // Only add if it's from the currently selected user
  //       if (message.senderId === selectedUser?._id) {
  //         dispatch(addMessage(message))
  //       }
  //     })

  //     return () => {
  //       socket.off('receiveMessage')
  //       socket.disconnect()
  //     }
  //   }
  // }, [user, selectedUser, dispatch])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
      {/* Header with logged-in user info */}
      <div className="w-full max-w-[900px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg shadow-lg px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="avatar">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 sm:ring ring-white ring-offset-1 sm:ring-offset-2">
              <img 
                src={user?.profilePic || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"} 
                alt={user?.fullName} 
              />
            </div>
          </div>
          <div className="text-white min-w-0">
            <p className="font-bold text-xs sm:text-sm md:text-lg truncate">{user?.fullName || 'User'}</p>
            <p className="text-[10px] sm:text-xs opacity-90 truncate">@{user?.username || 'username'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-[10px] sm:text-xs md:text-sm font-semibold px-2 sm:px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            Online
          </span>
        </div>
      </div>

      {/* Main chat container - responsive height and layout */}
      <div className="flex flex-col md:flex-row w-full max-w-[900px] h-[calc(100vh-120px)] sm:h-[500px] md:h-[600px] bg-white/90 backdrop-blur-sm rounded-b-lg shadow-lg overflow-hidden">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home