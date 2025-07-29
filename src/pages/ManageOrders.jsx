import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Plus, ArrowLeft } from 'lucide-react'

const ManageOrders = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [shippingToolsOpen, setShippingToolsOpen] = useState(false)
  
  // Table states
  const [activeTab, setActiveTab] = useState('Pending')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const mockOrders = [
    {
      id: 1,
      sysNumber: 'SYS001',
      retailer: 'Amazon',
      orderNumber: 'ORD-2024-001',
      dc: 'DC-A',
      clientId: 'CLIENT001',
      lines: 5,
      qty: 25,
      weight: '15.5 lbs',
      shipMethod: 'Express',
      lastUpdate: '2024-01-15',
      status: 'Pending'
    },
    {
      id: 2,
      sysNumber: 'SYS002',
      retailer: 'Walmart',
      orderNumber: 'ORD-2024-002',
      dc: 'DC-B',
      clientId: 'CLIENT002',
      lines: 3,
      qty: 12,
      weight: '8.2 lbs',
      shipMethod: 'Standard',
      lastUpdate: '2024-01-14',
      status: 'In Process'
    },
    {
      id: 3,
      sysNumber: 'SYS003',
      retailer: 'Target',
      orderNumber: 'ORD-2024-003',
      dc: 'DC-A',
      clientId: 'CLIENT003',
      lines: 8,
      qty: 40,
      weight: '22.1 lbs',
      shipMethod: 'Express',
      lastUpdate: '2024-01-13',
      status: 'Shipped'
    },
    {
      id: 4,
      sysNumber: 'SYS004',
      retailer: 'Best Buy',
      orderNumber: 'ORD-2024-004',
      dc: 'DC-C',
      clientId: 'CLIENT004',
      lines: 2,
      qty: 6,
      weight: '3.8 lbs',
      shipMethod: 'Standard',
      lastUpdate: '2024-01-12',
      status: 'Ready to Ship'
    },
    {
      id: 5,
      sysNumber: 'SYS005',
      retailer: 'Home Depot',
      orderNumber: 'ORD-2024-005',
      dc: 'DC-B',
      clientId: 'CLIENT005',
      lines: 6,
      qty: 18,
      weight: '12.7 lbs',
      shipMethod: 'Express',
      lastUpdate: '2024-01-11',
      status: 'Pending'
    },
    {
      id: 6,
      sysNumber: 'SYS006',
      retailer: 'Costco',
      orderNumber: 'ORD-2024-006',
      dc: 'DC-A',
      clientId: 'CLIENT006',
      lines: 4,
      qty: 12,
      weight: '8.5 lbs',
      shipMethod: 'Standard',
      lastUpdate: '2024-01-10',
      status: 'On Hold'
    },
    {
      id: 7,
      sysNumber: 'SYS007',
      retailer: 'Lowe\'s',
      orderNumber: 'ORD-2024-007',
      dc: 'DC-B',
      clientId: 'CLIENT007',
      lines: 3,
      qty: 9,
      weight: '5.2 lbs',
      shipMethod: 'Express',
      lastUpdate: '2024-01-09',
      status: 'Inbox'
    },
    {
      id: 8,
      sysNumber: 'SYS008',
      retailer: 'Macy\'s',
      orderNumber: 'ORD-2024-008',
      dc: 'DC-C',
      clientId: 'CLIENT008',
      lines: 5,
      qty: 15,
      weight: '7.8 lbs',
      shipMethod: 'Standard',
      lastUpdate: '2024-01-08',
      status: 'Routing'
    }
  ]

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

  // Tabs
  const tabs = [
    { id: 'On Hold', label: 'On Hold' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Inbox', label: 'Inbox' },
    { id: 'In Process', label: 'In Process' },
    { id: 'Routing', label: 'Routing' },
    { id: 'Ready to Ship', label: 'Ready to Ship' },
    { id: 'Shipped', label: 'Shipped' }
  ]

  const getFilteredOrders = () => {
    let filtered = mockOrders

    // Filter by active tab
    filtered = filtered.filter(order => order.status === activeTab)

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.retailer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sysNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getTabCount = (tabId) => {
    return mockOrders.filter(order => order.status === tabId).length
  }

  const getPaginatedOrders = () => {
    const filtered = getFilteredOrders()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredOrders().length / recordsPerPage)
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value))
  }

  const handleSearch = () => {
    setCurrentPage(1)
    console.log('Searching for:', searchTerm)
  }

  const exportToCSV = () => {
    const headers = [
      'Sys #', 'Retailer', 'Order #', 'DC', 'Client ID', 'Lines', 'Qty', 'Weight', 'Ship Method', 'Last Update', 'Status'
    ]

    const data = getFilteredOrders().map(order => [
      order.sysNumber || '',
      order.retailer || '',
      order.orderNumber || '',
      order.dc || '',
      order.clientId || '',
      order.lines || 0,
      order.qty || 0,
      order.weight || '',
      order.shipMethod || '',
      order.lastUpdate ? new Date(order.lastUpdate).toLocaleDateString() : '',
      order.status || ''
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`)
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
                      if (option.label === 'Manage Orders') {
                        setActiveTab('Pending')
                      } else {
                        navigate(option.path)
                      }
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
              <p className="text-sm text-gray-600">View and manage all orders</p>
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
          
          {/* Right side - Orders counter and buttons */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Showing {getPaginatedOrders().length} of {getFilteredOrders().length} orders
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
                onClick={() => navigate('/orders/create')}
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
          <div className="flex-1 min-w-0 px-1">Retailer</div>
          <div className="flex-1 min-w-0 px-1">Order #</div>
          <div className="flex-1 min-w-0 px-1">DC</div>
          <div className="flex-1 min-w-0 px-1">Client ID</div>
          <div className="flex-1 min-w-0 px-1">Lines</div>
          <div className="flex-1 min-w-0 px-1">Qty</div>
          <div className="flex-1 min-w-0 px-1">Weight</div>
          <div className="flex-1 min-w-0 px-1">Ship Method</div>
          <div className="flex-1 min-w-0 px-1">Last Update</div>
          <div className="flex-1 min-w-0 px-1">Status</div>
          <div className="flex-1 min-w-0 px-1">Action</div>
        </div>

        {/* Orders Rows */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getPaginatedOrders().map((order) => (
                          <div key={order.id} className="flex items-center border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
              <div className="flex items-center pl-2 w-8">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 px-1">{order.sysNumber}</div>
              <div className="flex-1 min-w-0 px-1">{order.retailer}</div>
              <div className="flex-1 min-w-0 px-1">{order.orderNumber}</div>
              <div className="flex-1 min-w-0 px-1">{order.dc}</div>
              <div className="flex-1 min-w-0 px-1">{order.clientId}</div>
              <div className="flex-1 min-w-0 px-1">{order.lines}</div>
              <div className="flex-1 min-w-0 px-1">{order.qty}</div>
              <div className="flex-1 min-w-0 px-1">{order.weight}</div>
              <div className="flex-1 min-w-0 px-1">{order.shipMethod}</div>
              <div className="flex-1 min-w-0 px-1 text-xs">
                {new Date(order.lastUpdate).toLocaleDateString()}
              </div>
                                <div className="flex-1 min-w-0 px-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                      order.status === 'Ready to Ship' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Routing' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Inbox' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 px-1">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      View
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Process Orders Button */}
        <div className="mt-3">
          <button
            onClick={() => console.log("Process selected orders")}
            className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Process Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageOrders 