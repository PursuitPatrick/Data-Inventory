import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const ProductsPipelineDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const options = [
    { label: 'Manage Products', path: '/inventory/products' },
    { label: 'Create Products', path: '/create-products' },
    { label: 'Create Child SKUs (Expiration)', path: '/create-child-expiration' },
    { label: 'Create Child SKUs (Serial #)', path: '/create-child-serial' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionClick = (path) => {
    setIsOpen(false)
    navigate(path)
  }

  const getCurrentLabel = () => {
    return 'Products Pipeline'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span>{getCurrentLabel()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.path)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  location.pathname === option.path ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const InventoryLayout = ({ children }) => {
  return (
    <div className="p-6">
      {/* Products Pipeline Dropdown */}
      <div className="mb-4">
        <ProductsPipelineDropdown />
      </div>
      
      {/* Page Content */}
      <div className="mt-2">
        {children}
      </div>
    </div>
  )
}

export default InventoryLayout 