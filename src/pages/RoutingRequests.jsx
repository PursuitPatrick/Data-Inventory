import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Plus, ArrowLeft } from 'lucide-react'

const RoutingRequests = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [shippingToolsOpen, setShippingToolsOpen] = useState(false)
  
  // Table states
  const [activeTab, setActiveTab] = useState('')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for routing requests
  const mockRoutingRequests = [
    {
      id: 1,
      shipDate: '2025-01-15',
      sysNumber: 'SYS001',
      orderNumber: 'ORD-2025-001',
      custPONumber: 'PO-001',
      clientId: 'CLIENT001',
      retailer: 'Amazon',
      dc: 'DC-A',
      shipMethod: 'Express',
      qty: 25,
      cost: 125.50,
      weight: '15.5 lbs',
      trackingNumber: '1Z999AA1234567890',
      status: 'Ready For Routing'
    },
    {
      id: 2,
      shipDate: '2025-01-16',
      sysNumber: 'SYS002',
      orderNumber: 'ORD-2025-002',
      custPONumber: 'PO-002',
      clientId: 'CLIENT002',
      retailer: 'Walmart',
      dc: 'DC-B',
      shipMethod: 'Standard',
      qty: 12,
      cost: 89.99,
      weight: '8.2 lbs',
      trackingNumber: '1Z999AA1234567891',
      status: 'Problem With Routing'
    },
    {
      id: 3,
      shipDate: '2025-01-17',
      sysNumber: 'SYS003',
      orderNumber: 'ORD-2025-003',
      custPONumber: 'PO-003',
      clientId: 'CLIENT003',
      retailer: 'Target',
      dc: 'DC-A',
      shipMethod: 'Express',
      qty: 40,
      cost: 245.75,
      weight: '22.1 lbs',
      trackingNumber: '1Z999AA1234567892',
      status: 'Routing Requested'
    },
    {
      id: 4,
      shipDate: '2025-01-18',
      sysNumber: 'SYS004',
      orderNumber: 'ORD-2025-004',
      custPONumber: 'PO-004',
      clientId: 'CLIENT004',
      retailer: 'Best Buy',
      dc: 'DC-C',
      shipMethod: 'Standard',
      qty: 6,
      cost: 67.25,
      weight: '3.8 lbs',
      trackingNumber: '1Z999AA1234567893',
      status: 'Ready For Routing'
    },
    {
      id: 5,
      shipDate: '2025-01-19',
      sysNumber: 'SYS005',
      orderNumber: 'ORD-2025-005',
      custPONumber: 'PO-005',
      clientId: 'CLIENT005',
      retailer: 'Home Depot',
      dc: 'DC-B',
      shipMethod: 'Express',
      qty: 18,
      cost: 156.80,
      weight: '12.7 lbs',
      trackingNumber: '1Z999AA1234567894',
      status: 'Routing Requested'
    },
    {
      id: 6,
      shipDate: '2025-01-20',
      sysNumber: 'SYS006',
      orderNumber: 'ORD-2025-006',
      custPONumber: 'PO-006',
      clientId: 'CLIENT006',
      retailer: 'Costco',
      dc: 'DC-A',
      shipMethod: 'Standard',
      qty: 12,
      cost: 98.45,
      weight: '8.5 lbs',
      trackingNumber: '1Z999AA1234567895',
      status: 'Pending'
    },
    {
      id: 7,
      shipDate: '2025-01-21',
      sysNumber: 'SYS007',
      orderNumber: 'ORD-2025-007',
      custPONumber: 'PO-007',
      clientId: 'CLIENT007',
      retailer: 'Lowe\'s',
      dc: 'DC-B',
      shipMethod: 'Express',
      qty: 9,
      cost: 78.90,
      weight: '5.2 lbs',
      trackingNumber: '1Z999AA1234567896',
      status: 'In Review'
    },
    {
      id: 8,
      shipDate: '2025-01-22',
      sysNumber: 'SYS008',
      orderNumber: 'ORD-2025-008',
      custPONumber: 'PO-008',
      clientId: 'CLIENT008',
      retailer: 'Macy\'s',
      dc: 'DC-C',
      shipMethod: 'Standard',
      qty: 15,
      cost: 134.20,
      weight: '7.8 lbs',
      trackingNumber: '1Z999AA1234567897',
      status: 'Approved'
    }
  ]

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

  const shippingToolsOptions = []

  // Tabs - routing request statuses
  const tabs = [
    { id: 'Ready For Routing', label: 'Ready For Routing' },
    { id: 'Problem With Routing', label: 'Problem With Routing' },
    { id: 'Routing Requested', label: 'Routing Requested' }
  ]

  const getFilteredRoutingRequests = () => {
    let filtered = mockRoutingRequests

    // Filter by active tab (if one is selected)
    if (activeTab) {
      filtered = filtered.filter(request => request.status === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.retailer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sysNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getTabCount = (tabId) => {
    return mockRoutingRequests.filter(request => request.status === tabId).length
  }

  const getPaginatedRoutingRequests = () => {
    const filtered = getFilteredRoutingRequests()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredRoutingRequests().length / recordsPerPage)
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value))
    setCurrentPage(1)
  }

  const handlePageChange = (value) => {
    setCurrentPage(Number(value))
  }

  const handleSearch = () => {
    setCurrentPage(1)
    console.log('Searching for:', searchTerm)
  }

  const exportToCSV = () => {
    const headers = [
      'Sys #', 'Order #', 'DC', 'Client ID', 'Retailer', 'PO #', 'Boxes', 'Weight', 'Ship Method', 'Status', 'Ship Start', 'Ship End'
    ]

    const data = getFilteredRoutingRequests().map(request => [
      request.sysNumber || '',
      request.orderNumber || '',
      request.dc || '',
      request.clientId || '',
      request.retailer || '',
      request.custPONumber || '',
      request.qty || '',
      request.weight || '',
      request.shipMethod || '',
      request.status || '',
      request.shipDate ? new Date(request.shipDate).toLocaleDateString() : '',
      request.shipDate ? new Date(request.shipDate).toLocaleDateString() : ''
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `routing_requests_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`)
    link.click()
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
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Routing Requests' 
                        ? 'bg-blue-100 text-blue-700' 
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
              <h1 className="text-2xl font-bold text-gray-900">Routing Requests</h1>
              <p className="text-sm text-gray-600">View and manage routing requests</p>
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
          
          {/* Right side - Requests counter and buttons */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Showing {getPaginatedRoutingRequests().length} of {getFilteredRoutingRequests().length} requests
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={() => console.log('Create new routing request')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Dropdowns and Search - Vertical Stack */}
        <div className="flex flex-col items-end mt-2 space-y-2">
          {/* Pagination Dropdowns - Horizontal Layout */}
          <div className="flex space-x-2 mt-1">
            {/* Records Per Page */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Records Per Page
              </label>
              <select
                value={recordsPerPage}
                onChange={(e) => handleRecordsPerPageChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>

            {/* Page Number */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Page
              </label>
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
              >
                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    Page {page}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  console.log('Search term:', e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                placeholder="Search by Order Number, Client ID, or Retailer"
                className="text-xs px-2 py-1 border border-gray-300 rounded w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="ml-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:bg-gray-50'
                }`}
              >
                {tab.label} ({getTabCount(tab.id)})
              </button>
            ))}
          </div>
        </div>

        {/* Column Headers */}
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center text-xs font-medium">
          <div className="flex items-center pl-2 w-8">
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 px-1">Sys #</div>
          <div className="flex-1 min-w-0 px-1">Order #</div>
          <div className="flex-1 min-w-0 px-1">DC</div>
          <div className="flex-1 min-w-0 px-1">Client ID</div>
          <div className="flex-1 min-w-0 px-1">Retailer</div>
          <div className="flex-1 min-w-0 px-1">PO #</div>
          <div className="flex-1 min-w-0 px-1">Boxes</div>
          <div className="flex-1 min-w-0 px-1">Weight</div>
          <div className="flex-1 min-w-0 px-1">Ship Method</div>
          <div className="flex-1 min-w-0 px-1">Status</div>
          <div className="flex-1 min-w-0 px-1">Ship Start</div>
          <div className="flex-1 min-w-0 px-1">Ship End</div>
        </div>

        {/* Routing Requests Rows */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getPaginatedRoutingRequests().map((request) => (
            <div key={request.id} className="flex items-center border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
              <div className="flex items-center pl-2 w-8">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 px-1">{request.sysNumber}</div>
              <div className="flex-1 min-w-0 px-1">{request.orderNumber}</div>
              <div className="flex-1 min-w-0 px-1">{request.dc}</div>
              <div className="flex-1 min-w-0 px-1">{request.clientId}</div>
              <div className="flex-1 min-w-0 px-1">{request.retailer}</div>
              <div className="flex-1 min-w-0 px-1">{request.custPONumber}</div>
              <div className="flex-1 min-w-0 px-1">{request.qty}</div>
              <div className="flex-1 min-w-0 px-1">{request.weight}</div>
              <div className="flex-1 min-w-0 px-1">{request.shipMethod}</div>
              <div className="flex-1 min-w-0 px-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Ready For Routing' ? 'bg-green-100 text-green-800' :
                  request.status === 'Problem With Routing' ? 'bg-red-100 text-red-800' :
                  request.status === 'Routing Requested' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {request.status}
                </span>
              </div>
              <div className="flex-1 min-w-0 px-1 text-xs">
                {new Date(request.shipDate).toLocaleDateString()}
              </div>
              <div className="flex-1 min-w-0 px-1 text-xs">
                {new Date(request.shipDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Process Requests Button */}
        <div className="mt-3">
          <button
            onClick={() => console.log("Process selected routing requests")}
            className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Process Requests
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoutingRequests 