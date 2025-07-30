import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Plus, ArrowLeft, Calendar } from 'lucide-react'

const RoutingRequests = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [shippingToolsOpen, setShippingToolsOpen] = useState(false)
  
  // Table states
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter states
  const [filterData, setFilterData] = useState({
    brandId: 'MAGM - MAGM LLC',
    warehouseId: 'All Warehouses',
    carriers: 'All Carriers',
    shipMethods: 'All Ship Methods',
    fromDate: '2025-07-30',
    toDate: '2025-07-30',
    retailers: 'All Retailers',
    sku: ''
  })

  // Date range state
  const [selectedDateRange, setSelectedDateRange] = useState('Today')

  // Mock data for routing requests
  const mockRoutingRequests = [
    {
      id: 1,
      requestNumber: 'RR-2024-001',
      orderNumber: 'ORD-2024-001',
      clientId: 'CLIENT001',
      requestType: 'Route Change',
      priority: 'High',
      status: 'Pending',
      requestedBy: 'John Doe',
      requestDate: '2024-01-15',
      description: 'Change shipping route to avoid delays'
    },
    {
      id: 2,
      requestNumber: 'RR-2024-002',
      orderNumber: 'ORD-2024-002',
      clientId: 'CLIENT002',
      requestType: 'Carrier Change',
      priority: 'Medium',
      status: 'In Review',
      requestedBy: 'Jane Smith',
      requestDate: '2024-01-14',
      description: 'Switch to faster carrier for urgent delivery'
    },
    {
      id: 3,
      requestNumber: 'RR-2024-003',
      orderNumber: 'ORD-2024-003',
      clientId: 'CLIENT003',
      requestType: 'Address Update',
      priority: 'Low',
      status: 'Approved',
      requestedBy: 'Bob Johnson',
      requestDate: '2024-01-13',
      description: 'Update delivery address for customer'
    },
    {
      id: 4,
      requestNumber: 'RR-2024-004',
      orderNumber: 'ORD-2024-004',
      clientId: 'CLIENT004',
      requestType: 'Route Change',
      priority: 'High',
      status: 'Rejected',
      requestedBy: 'Alice Brown',
      requestDate: '2024-01-12',
      description: 'Alternative route due to weather conditions'
    },
    {
      id: 5,
      requestNumber: 'RR-2024-005',
      orderNumber: 'ORD-2024-005',
      clientId: 'CLIENT005',
      requestType: 'Carrier Change',
      priority: 'Medium',
      status: 'Pending',
      requestedBy: 'Charlie Wilson',
      requestDate: '2024-01-11',
      description: 'Change to more cost-effective carrier'
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



  const getFilteredRequests = () => {
    let filtered = mockRoutingRequests

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }



  const getPaginatedRequests = () => {
    const filtered = getFilteredRequests()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredRequests().length / recordsPerPage)
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

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const exportToCSV = () => {
    const headers = [
      'Request #', 'Order #', 'Client ID', 'Request Type', 'Priority', 'Status', 'Requested By', 'Request Date', 'Description'
    ]

    const data = getFilteredRequests().map(request => [
      request.requestNumber || '',
      request.orderNumber || '',
      request.clientId || '',
      request.requestType || '',
      request.priority || '',
      request.status || '',
      request.requestedBy || '',
      request.requestDate ? new Date(request.requestDate).toLocaleDateString() : '',
      request.description || ''
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
                      if (option.label === 'Routing Requests') {
                        // Stay on current page
                      } else {
                        navigate(option.path)
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Routing Requests' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
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

            {/* Filter Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Routing Requests Filters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Brand ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand ID</label>
                  <select
                    value={filterData.brandId}
                    onChange={(e) => handleFilterChange('brandId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
                    <option value="BRAND-001 - WestCo Distribution">BRAND-001 - WestCo Distribution</option>
                    <option value="BRAND-002 - Metro Supplies">BRAND-002 - Metro Supplies</option>
                  </select>
                </div>

                {/* Warehouse ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse ID</label>
                  <select
                    value={filterData.warehouseId}
                    onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Warehouses">All Warehouses</option>
                    <option value="WH-001 - Fort Lauderdale">WH-001 - Fort Lauderdale</option>
                    <option value="WH-002 - Bronx, NY">WH-002 - Bronx, NY</option>
                    <option value="WH-003 - Los Angeles">WH-003 - Los Angeles</option>
                  </select>
                </div>

                {/* Carriers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carriers</label>
                  <select
                    value={filterData.carriers}
                    onChange={(e) => handleFilterChange('carriers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Carriers">All Carriers</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                  </select>
                </div>

                {/* Ship Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ship Methods</label>
                  <select
                    value={filterData.shipMethods}
                    onChange={(e) => handleFilterChange('shipMethods', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Ship Methods">All Ship Methods</option>
                    <option value="Ground">Ground</option>
                    <option value="Express">Express</option>
                    <option value="Overnight">Overnight</option>
                    <option value="2-Day">2-Day</option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filterData.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filterData.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Retailers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retailers</label>
                  <select
                    value={filterData.retailers}
                    onChange={(e) => handleFilterChange('retailers', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Retailers">All Retailers</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Walmart">Walmart</option>
                    <option value="Target">Target</option>
                    <option value="Best Buy">Best Buy</option>
                    <option value="Home Depot">Home Depot</option>
                  </select>
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={filterData.sku}
                    onChange={(e) => handleFilterChange('sku', e.target.value)}
                    placeholder="Enter SKU"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Show Results Button */}
                <div className="flex items-end">
                  <button
                    onClick={() => console.log('Show Results clicked')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>

            {/* Date Range Options */}
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-center space-x-4 text-sm">
                <button
                  onClick={() => setSelectedDateRange('Today')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'Today'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDateRange('Yesterday')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'Yesterday'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setSelectedDateRange('This Week')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'This Week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setSelectedDateRange('Last Week')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'Last Week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Last Week
                </button>
                <button
                  onClick={() => setSelectedDateRange('This Month')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'This Month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setSelectedDateRange('Last Month')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'Last Month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Last Month
                </button>
                <button
                  onClick={() => setSelectedDateRange('Custom Dates')}
                  className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                    selectedDateRange === 'Custom Dates'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Custom Dates
                </button>
              </div>
              
              {/* Warning Text */}
              <div className="mt-3 text-center">
                <p className="text-red-600 text-sm font-medium">
                  Search Date range limited to Today - 180 Days
                </p>
              </div>
            </div>
          </div>
          
          {/* Right side - Requests counter and buttons */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Showing {getPaginatedRequests().length} of {getFilteredRequests().length} requests
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
                onClick={() => navigate('/orders/routing-requests/create')}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch()
                  }
                }}
                placeholder="Search by Request #, Order #, or Client ID"
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

        {/* Column Headers */}
        <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] text-sm font-medium">
          <div className="flex items-center pl-2">
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div>Ship Date</div>
          <div>Sys #</div>
          <div>Order #</div>
          <div>Cust PO #</div>
          <div>Client ID</div>
          <div>Retailer</div>
          <div>DC</div>
          <div>Ship Method</div>
          <div>Qty</div>
          <div>Cost</div>
          <div>Weight</div>
          <div>Tracking #</div>
        </div>

        {/* Routing Requests Rows */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getPaginatedRequests().map((request) => (
            <div key={request.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
              <div className="flex items-center pl-2">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center">{new Date(request.requestDate).toLocaleDateString()}</div>
              <div className="flex items-center">{request.requestNumber}</div>
              <div className="flex items-center">{request.orderNumber}</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">{request.clientId}</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
              <div className="flex items-center">-</div>
            </div>
          ))}
        </div>

        {/* Approve Requests Button */}
        <div className="mt-3">
          <button
            onClick={() => console.log("Approve selected requests")}
            className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Approve Requests
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoutingRequests 