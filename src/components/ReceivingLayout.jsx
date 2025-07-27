import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

const ReceivingLayout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const options = [
    { label: 'Manage POs', path: '/receiving/manage-pos' },
    { label: 'Create PO', path: '/receiving/create-po' },
    { label: 'Receive Items', path: '/receiving/receive-items' },
    { label: 'PO Templates', path: '/receiving/templates' }
  ]

  const getCurrentLabel = () => {
    return 'Purchase Order Pipeline'
  }

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
    navigate(path)
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Receiving Pipeline Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span>{getCurrentLabel()}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.path}
                  onClick={() => handleOptionClick(option.path)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="mt-2">
        {children}
      </div>
    </div>
  )
}

export default ReceivingLayout 