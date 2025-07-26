import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ShoppingCart, Map, BarChart3, Truck } from 'lucide-react'

const SectionNav = () => {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const sections = [
    {
      id: 'sales',
      label: 'Sales Orders Pipeline',
      icon: ShoppingCart,
      items: [
        { label: 'New Orders', href: '/sales/new' },
        { label: 'Pending Approval', href: '/sales/pending' },
        { label: 'In Production', href: '/sales/production' },
        { label: 'Completed', href: '/sales/completed' }
      ]
    },
    {
      id: 'routing',
      label: 'Routing',
      icon: Map,
      items: [
        { label: 'Route Planning', href: '/routing/planning' },
        { label: 'Route Optimization', href: '/routing/optimization' },
        { label: 'Route History', href: '/routing/history' },
        { label: 'Route Analytics', href: '/routing/analytics' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      items: [
        { label: 'Inventory Reports', href: '/reports/inventory' },
        { label: 'Sales Reports', href: '/reports/sales' },
        { label: 'Performance Reports', href: '/reports/performance' },
        { label: 'Custom Reports', href: '/reports/custom' }
      ]
    },
    {
      id: 'shipping-tools',
      label: 'Shipping Tools',
      icon: Truck,
      items: [
        { label: 'Label Generator', href: '/shipping/labels' },
        { label: 'Tracking Tools', href: '/shipping/tracking' },
        { label: 'Rate Calculator', href: '/shipping/rates' },
        { label: 'Shipping Analytics', href: '/shipping/analytics' }
      ]
    }
  ]

  const handleDropdownToggle = (sectionId) => {
    setActiveDropdown(activeDropdown === sectionId ? null : sectionId)
  }

  const handleDropdownClose = () => {
    setActiveDropdown(null)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="px-6 py-4">
        <nav ref={navRef} className="flex items-center justify-center space-x-8">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeDropdown === section.id
            
            return (
              <div key={section.id} className="relative">
                <button
                  onClick={() => handleDropdownToggle(section.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActive ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Dropdown Menu */}
                {isActive && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="py-2">
                      {section.items.length > 0 ? (
                        section.items.map((item, index) => (
                          <a
                            key={index}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          >
                            {item.label}
                          </a>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 italic">
                          Coming soon...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default SectionNav 