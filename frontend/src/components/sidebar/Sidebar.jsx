import React from 'react'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import LogoutButton from './LogoutButton'

function Sidebar() {
    return (
        <div className='bg-blue-100 p-2 sm:p-3 md:p-4 w-full md:w-[300px] md:border-r flex flex-col h-1/3 md:h-full border-b md:border-b-0'>
            <SearchInput />
            <div className='divider px-2 sm:px-3 my-1 sm:my-2'></div>

            <div className="flex-1 overflow-y-auto">
                <Conversations />
            </div>
            
            <LogoutButton />
        </div>
    )
}

export default Sidebar