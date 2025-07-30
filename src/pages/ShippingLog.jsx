import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowLeft, Calendar, Search, Download, Plus } from 'lucide-react'

const ShippingLog = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [shippingToolsOpen, setShippingToolsOpen] = useState(false)

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

  // Table states
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for shipping log
  const mockShippingLog = [
    {
      id: 1,
      shipDate: '2025-01-15',
      sysNumber: 'SYS-001',
      orderNumber: 'ORD-001',
      custPONumber: 'PO-001',
      clientId: 'MAGM - MAGM LLC',
      retailer: 'Amazon',
      dc: 'DC-001',
      shipMethod: 'Ground',
      qty: 5,
      cost: 125.50,
      weight: 2.5,
      trackingNumber: '1Z999AA1234567890'
    },
    {
      id: 2,
      shipDate: '2025-01-16',
      sysNumber: 'SYS-002',
      orderNumber: 'ORD-002',
      custPONumber: 'PO-002',
      clientId: 'MAGM - MAGM LLC',
      retailer: 'Walmart',
      dc: 'DC-002',
      shipMethod: 'Express',
      qty: 3,
      cost: 89.99,
      weight: 1.8,
      trackingNumber: '1Z999AA1234567891'
    },
    {
      id: 3,
      shipDate: '2025-01-17',
      sysNumber: 'SYS-003',
      orderNumber: 'ORD-003',
      custPONumber: 'PO-003',
      clientId: 'MAGM - MAGM LLC',
      retailer: 'Target',
      dc: 'DC-001',
      shipMethod: '2-Day',
      qty: 8,
      cost: 245.75,
      weight: 4.2,
      trackingNumber: '1Z999AA1234567892'
    }
  ]

  // Dropdown options
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

  const shippingToolsOptions = [
    { label: 'Shipping Tools', path: '/orders/shipping-tools' }
  ]

  const getFilteredShippingLog = () => {
    let filtered = mockShippingLog

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.sysNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getPaginatedShippingLog = () => {
    const filtered = getFilteredShippingLog()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredShippingLog().length / recordsPerPage)
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value)
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
      'Ship Date', 'Sys #', 'Order #', 'Cust PO #', 'Client ID', 'Retailer', 'DC', 'Ship Method', 'Qty', 'Cost', 'Weight', 'Tracking #'
    ]

    const data = getFilteredShippingLog().map(log => [
      log.shipDate ? new Date(log.shipDate).toLocaleDateString() : '',
      log.sysNumber || '',
      log.orderNumber || '',
      log.custPONumber || '',
      log.clientId || '',
      log.retailer || '',
      log.dc || '',
      log.shipMethod || '',
      log.qty || '',
      log.cost ? log.cost.toFixed(2) : '',
      log.weight ? `${log.weight} lbs` : '',
      log.trackingNumber || ''
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `shipping_log_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`)
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
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Shipping Log' 
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
              <h1 className="text-2xl font-bold text-gray-900">Shipping Log</h1>
              <p className="text-sm text-gray-600">Track and manage shipping activities</p>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Log Filters</h2>
              
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
              <div className="mt-2 text-center">
                <p className="text-red-600 text-sm font-medium">
                  Search Date range limited to Today - 180 Days
                </p>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              {/* Records per page and pagination */}
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Records per page
                  </label>
                  <select
                    value={recordsPerPage}
                    onChange={(e) => handleRecordsPerPageChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

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
                    placeholder="Search by Sys #, Order #, or Tracking #"
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

            {/* Shipping Log Rows */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {getPaginatedShippingLog().map((log) => (
                <div key={log.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
                  <div className="flex items-center pl-2">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  <div className="flex items-center">{new Date(log.shipDate).toLocaleDateString()}</div>
                  <div className="flex items-center">{log.sysNumber}</div>
                  <div className="flex items-center">{log.orderNumber}</div>
                  <div className="flex items-center">{log.custPONumber}</div>
                  <div className="flex items-center">{log.clientId}</div>
                  <div className="flex items-center">{log.retailer}</div>
                  <div className="flex items-center">{log.dc}</div>
                  <div className="flex items-center">{log.shipMethod}</div>
                  <div className="flex items-center">{log.qty}</div>
                  <div className="flex items-center">${log.cost.toFixed(2)}</div>
                  <div className="flex items-center">{log.weight} lbs</div>
                  <div className="flex items-center">{log.trackingNumber}</div>
                </div>
              ))}
            </div>

            {/* Approve Requests Button */}
            <div className="mt-3">
              <button
                onClick={() => console.log("Approve selected shipping logs")}
                className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
              >
                Approve Shipping Logs
              </button>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={() => console.log('Create new shipping log entry')}
              className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingLog 