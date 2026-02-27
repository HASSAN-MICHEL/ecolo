import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const Layout = ({ children, pageTitle, currentPage, notifications, userRole = 'producer' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar - Slide from left */}
      <div className="lg:hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
          userRole={userRole}
        />
      </div>

      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
        <Sidebar 
          isOpen={false} 
          toggleSidebar={toggleSidebar}
          currentPage={currentPage}
          userRole={userRole}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
        {/* Navbar - Fixed */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <Navbar 
            toggleSidebar={toggleSidebar}
            pageTitle={pageTitle}
            notifications={notifications}
          />
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
