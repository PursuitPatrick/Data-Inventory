import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { X, BarChart3, Package, RotateCcw, ShoppingCart, ArrowLeft, Wrench, ChevronDown, ChevronRight } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3, hasDropdown: false },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package, 
    hasDropdown: true,
    dropdownItems: [
      { name: 'Products', href: '/inventory/products' },
      { name: 'Receiving', href: '/receiving/manage-pos' },
      { name: 'Warehouse', href: '/inventory/warehouse/manage-inventory' }
    ]
  },
  { name: 'Rework', href: '/rework', icon: RotateCcw, hasDropdown: false },
  { name: 'Orders', href: '/orders', icon: ShoppingCart, hasDropdown: false },
  { name: 'Returns', href: '/returns', icon: ArrowLeft, hasDropdown: false },
  { name: 'Tools', href: '/tools', icon: Wrench, hasDropdown: false },
]

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-medium transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:relative lg:flex-shrink-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-primary-600" />
            <span className="ml-3 text-xl font-semibold text-gray-900">AI Inventory</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.hasDropdown && item.dropdownItems?.some(subItem => location.pathname === subItem.href))
              
              if (item.hasDropdown) {
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setInventoryDropdownOpen(!inventoryDropdownOpen)}
                      className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                        }`} />
                        {item.name}
                      </div>
                      {inventoryDropdownOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {inventoryDropdownOpen && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.dropdownItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.href
                          return (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isSubActive
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                              onClick={() => setOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </div>


        </nav>
      </div>
    </>
  )
}

export default Sidebar 