import React from 'react'
import { useSelector } from 'react-redux'
import Sidebar from '../../components/sidebar/Sidebar.jsx'
import MessageContainer from '../../components/messages/MessageContainer.jsx'

function Home () {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Header with logged-in user info */}
      <div className="w-[900px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg shadow-lg px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full ring ring-white ring-offset-2">
              <img 
                src={user?.profilePic || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"} 
                alt={user?.fullName} 
              />
            </div>
          </div>
          <div className="text-white">
            <p className="font-bold text-lg">{user?.fullName || 'User'}</p>
            <p className="text-xs opacity-90">@{user?.username || 'username'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-semibold px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            Online
          </span>
        </div>
      </div>

      {/* Main chat container */}
      <div className="flex w-[900px] h-[600px] bg-white/90 backdrop-blur-sm rounded-b-lg shadow-lg overflow-hidden">
        <Sidebar />
        <MessageContainer />
      </div>
    </div>
  )
}

export default Home