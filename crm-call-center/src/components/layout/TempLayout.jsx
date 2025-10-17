import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = () => {
    const [sidebarOpen, setsidebarOpen] = useState(true);
    return (
        <div className='flex h-screen bg-gray-50'>
            <Sidebar isOpen={sidebarOpen} setIsOpen={setsidebarOpen} />

            <div className='flex-1 flex flex-col overflow-hidden'>
                <Topbar toggleSidebar={() => setsidebarOpen(!isSidebarOpen)} />
                <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout