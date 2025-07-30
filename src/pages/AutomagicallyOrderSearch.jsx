import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowLeft } from 'lucide-react'

const AutomagicallyOrderSearch = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)

  // Dropdown options - EXACTLY matching ManageOrders
  const salesOrderPipelineOptions = [
    { label: 'Manage Orders', path: '/orders' },
    { label: 'Create Order', path: '/orders/create' },
    { label: 'Order Lookup', path: '/orders/lookup' },
    { label: 'Rapid Lookup', path: '/orders/rapid-lookup' },
    { label: 'Automagically Order Search', path: '/orders/automagically-search' }
  ]

  const routingOptions = [
    { label: 'Routing Requests', path: '/orders/routing-requests' }
  ]

  const reportsOptions = [
    { label: 'Shipping Log', path: '/orders/shipping-log' }
  ]

  return (
    <div className="p-6">
      {/* Dropdowns Container - EXACTLY matching ManageOrders layout */}
      <div className="mb-4 flex space-x-4">
        {/* Sales Order Pipeline Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSalesOrderPipelineOpen(!salesOrderPipelineOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Sales Order Pipeline</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${salesOrderPipelineOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {salesOrderPipelineOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {salesOrderPipelineOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSalesOrderPipelineOpen(false)
                      if (option.label === 'Manage Orders') {
                        navigate('/orders')
                      } else {
                        navigate(option.path)
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Automagically Order Search' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Routing Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoutingOpen(!routingOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Routing</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${routingOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {routingOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {routingOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setRoutingOpen(false)
                      navigate(option.path)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reports Dropdown */}
        <div className="relative">
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Reports</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${reportsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {reportsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {reportsOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setReportsOpen(false)
                      navigate(option.path)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Automagically Order Search</h1>
              <p className="text-sm text-gray-600">Intelligent order matching and retrieval</p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>
        </div>

        {/* Automagically Order Search Section Header */}
        <div className="mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
            <h3 className="text-base font-bold text-gray-900">
              ⚙️ Automagically Order Search
            </h3>
          </div>
        </div>

        {/* Caution Line */}
        <div className="mt-3">
          <p className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-semibold">
            ⚠️ Type a list of order numbers, one per row.
          </p>
        </div>

        {/* Order Information Section Header */}
        <div className="mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
            <h3 className="text-base font-bold text-gray-900">
              📦 Order Information
            </h3>
          </div>
        </div>

        {/* Client ID Dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client ID<span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue="MAGM - MAGM LLC"
          >
            <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
          </select>
        </div>

        {/* Order No Section Header */}
        <div className="mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
            <h3 className="text-base font-bold text-gray-900">
              🧾 Order No
            </h3>
          </div>
        </div>

        {/* Order No Input Field */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter or Scan Order Numbers (1 per row)
          </label>
          <textarea
            placeholder="Scan or enter order numbers, one per line"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default AutomagicallyOrderSearch 