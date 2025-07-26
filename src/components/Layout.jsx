import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import SectionNav from './SectionNav'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <SectionNav />
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 w-full lg:pl-8 px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout 