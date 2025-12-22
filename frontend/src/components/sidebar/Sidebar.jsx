import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'

function Sidebar() {
    return (
        <div className='bg-blue-100 p-4 w-[300px] border-r flex flex-col h-full'>
            <SearchInput />
            <div className='divider px-3 my-2'></div>

            <div className="flex-1 overflow-y-auto">
                <Conversations />
            </div>
            
            <LogoutButton />
        </div>
    )
}

export default Sidebar