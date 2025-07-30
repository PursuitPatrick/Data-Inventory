import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowLeft } from 'lucide-react'

const RapidLookup = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [shippingToolsOpen, setShippingToolsOpen] = useState(false)

  // Dropdown options
  const salesOrderPipelineOptions = [
    { label: 'Manage Orders', path: '/orders' },
    { label: 'Create Order', path: '/orders/create' },
    { label: 'Order Lookup', path: '/orders/lookup' },
    { label: 'Rapid Lookup', path: '/orders/rapid-lookup' },
    { label: 'Automagically Order Search', path: '/orders/auto-search' }
  ]

  const routingOptions = [
    { label: 'Routing Requests', path: '/orders/routing-requests' }
  ]

  const reportsOptions = [
    { label: 'Shipping Log', path: '/orders/shipping-log' }
  ]

  const shippingToolsOptions = []

  const handleRandomLookup = () => {
    console.log('Random Lookup button clicked')
    // TODO: Add random lookup functionality
  }

  return (
    <div className="p-6">
      {/* Dropdowns Container */}
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
                      if (option.label === 'Rapid Lookup') {
                        // Stay on current page
                      } else {
                        navigate(option.path)
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Rapid Lookup' 
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                        : 'text-gray-700 hover:bg-gray-100'
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

        {/* Shipping Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShippingToolsOpen(!shippingToolsOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Shipping Tools</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${shippingToolsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {shippingToolsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {shippingToolsOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setShippingToolsOpen(false)
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rapid Lookup</h1>
              <p className="text-sm text-gray-600">Quick search and lookup functionality</p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            {/* Random Lookup Section Header */}
            <div className="mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                <h3 className="text-base font-bold text-gray-900">
                  🧠 Rapid Lookup
                </h3>
              </div>
            </div>

            {/* Caution Line */}
            <div className="mt-3">
              <p className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-semibold">
                ⚠️ Type a List of orders for 1 order per row.
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
              >
                <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
              </select>
            </div>

            {/* Order No Section Header */}
            <div className="mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3">
                <h3 className="text-base font-bold text-gray-900">
                  🔢 Order No
                </h3>
              </div>
            </div>

            {/* Order No Input Field */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter / Scan Order Numbers
              </label>
              <input
                type="text"
                placeholder="Scan or enter order number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(salesOrderPipelineOpen || routingOpen || reportsOpen || shippingToolsOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setSalesOrderPipelineOpen(false)
            setRoutingOpen(false)
            setReportsOpen(false)
            setShippingToolsOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default RapidLookup 