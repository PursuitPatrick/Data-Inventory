import { Menu, Search, Bell, User } from 'lucide-react'
import { useState } from 'react'

const TopBar = ({ onMenuClick }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('Fort Lauderdale, Florida')

  const handleWarehouseChange = (event) => {
    const newWarehouse = event.target.value
    setSelectedWarehouse(newWarehouse)
    console.log(`Warehouse changed to: ${newWarehouse}`)
    // TODO: Fetch warehouse-specific data here
  }
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-4 lg:mx-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory, orders, suppliers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Warehouse Location Toggle */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 hidden sm:block">
              Warehouse:
            </label>
            <select
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="Fort Lauderdale, Florida">Fort Lauderdale, Florida</option>
              <option value="Bronx, New York">Bronx, New York</option>
            </select>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-500"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Warehouse Manager</p>
            </div>
            <button className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors duration-200">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar 