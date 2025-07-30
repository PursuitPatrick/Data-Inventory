import { useState } from 'react'
import { ArrowLeft, Download, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderLookup = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  // State for filter data - simplified to just dates
  const [filterData, setFilterData] = useState({
    fromDate: '2025-07-27',
    toDate: '2025-07-27'
  })

  // State for form fields
  const [formData, setFormData] = useState({
    // Order Details
    shipDate: '',
    sysOrderNumber: '',
    numberOfBoxes: '',
    brandId: 'MAGM - MAGM LLC',
    clientOrderNumber: '',
    ref01: '',
    customerPONumber: '',
    ref02: '',
    boxId: '',
    ref03: '',
    trackingNumber: '',
    ref04: '',
    channel: 'All Channels',
    ref05: '',
    ref06: '',
    
    // Ship To Details
    shipToName1: '',
    shipToCountry: 'All Countries',
    shipToEmail: '',
    shipToName2: '',
    stateProvince: '',
    shipToTel: '',
    shipToAddress1: '',
    shipToCity: '',
    customerPO: '',
    shipToAddress2: '',
    shipToZip: '',
    
    // Billing Details
    billToType: 'All Types',
    billToCountry: 'All Countries',
    orderCOD: '',
    billToAccountNum: '',
    billToState: '',
    orderCODValue: '',
    billToName1: '',
    billToCity: '',
    orderCODReqCashMO: 'All',
    billToName2: '',
    billToZip: '',
    orderCODAddShipCost: 'All',
    billToAddress1: '',
    billToTel: '',
    billingAddress2: ''
  })

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // State for date range shortcuts
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [dateError, setDateError] = useState('')

  // State for records per page
  const [recordsPerPage, setRecordsPerPage] = useState(25)

  // State for current page
  const [currentPage, setCurrentPage] = useState(1)

  // State for notification
  const [showNotification, setShowNotification] = useState(false)

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle records per page change
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(parseInt(value))
  }

  // Handle page number change
  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value))
  }

  // Handle show results click
  const handleShowResults = () => {
    console.log('Show Results clicked')
    console.log('Filter data:', filterData)
    console.log('Selected date range:', selectedDateRange)
    
    // Mock functionality - simulate no records found
    // In real implementation, this would check actual data
    const hasNoRecords = true // Mock: always show no records for demo
    
    if (hasNoRecords) {
      setShowNotification(true)
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 4000)
    }
  }

  // Handle clear search
  const handleClearSearch = () => {
    setFilterData({
      fromDate: '2025-07-27',
      toDate: '2025-07-27'
    })
    setSelectedDateRange('')
    setDateError('')
  }

  // Handle export functionality
  const handleExport = () => {
    console.log('Export clicked')
    console.log('Exporting data with filters:', filterData)
    
    // Mock export functionality
    // In real implementation, this would generate and download a CSV file
    alert('Export functionality would generate a CSV file with the current filter results.')
  }

  // Date range options
  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'lastWeek', label: 'Last Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'custom', label: 'Custom Dates' }
  ]

  // Calculate date ranges
  const calculateDateRange = (rangeType) => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (rangeType) {
      case 'today':
        return { from: todayStr, to: todayStr }
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        return { from: yesterdayStr, to: yesterdayStr }
      case 'thisWeek':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return { 
          from: startOfWeek.toISOString().split('T')[0], 
          to: endOfWeek.toISOString().split('T')[0] 
        }
      case 'lastWeek':
        const startOfLastWeek = new Date(today)
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7)
        const endOfLastWeek = new Date(startOfLastWeek)
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
        return { 
          from: startOfLastWeek.toISOString().split('T')[0], 
          to: endOfLastWeek.toISOString().split('T')[0] 
        }
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return { 
          from: startOfMonth.toISOString().split('T')[0], 
          to: endOfMonth.toISOString().split('T')[0] 
        }
      case 'lastMonth':
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        return { 
          from: startOfLastMonth.toISOString().split('T')[0], 
          to: endOfLastMonth.toISOString().split('T')[0] 
        }
      case 'custom':
        return { from: filterData.fromDate, to: filterData.toDate }
      default:
        return { from: todayStr, to: todayStr }
    }
  }

  // Validate date range
  const validateDateRange = (fromDate, toDate) => {
    const today = new Date()
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const daysDiff = Math.ceil((today - from) / (1000 * 60 * 60 * 24))
    
    if (daysDiff > 180) {
      setDateError('Date range cannot exceed 180 days from today')
      return false
    }
    
    if (from > to) {
      setDateError('From date cannot be after To date')
      return false
    }
    
    setDateError('')
    return true
  }

  // Handle date range click
  const handleDateRangeClick = (rangeId) => {
    setSelectedDateRange(rangeId)
    
    if (rangeId === 'custom') {
      return // Don't auto-fill for custom
    }
    
    const dateRange = calculateDateRange(rangeId)
    setFilterData(prev => ({
      ...prev,
      fromDate: dateRange.from,
      toDate: dateRange.to
    }))
    
    // Validate the new date range
    validateDateRange(dateRange.from, dateRange.to)
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
                <button
                  onClick={() => {
                    setSalesOrderPipelineOpen(false)
                    navigate('/orders')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Manage Orders
                </button>
                <button
                  onClick={() => {
                    setSalesOrderPipelineOpen(false)
                    navigate('/orders/create')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Create Order
                </button>
                <button
                  onClick={() => {
                    setSalesOrderPipelineOpen(false)
                    navigate('/orders/lookup')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  Order Lookup
                </button>
                <button
                  onClick={() => {
                    setSalesOrderPipelineOpen(false)
                    navigate('/orders/rapid-lookup')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Rapid Lookup
                </button>
                <button
                  onClick={() => {
                    setSalesOrderPipelineOpen(false)
                    navigate('/orders/automagically-search')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Automagically Order Search
                </button>
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
                <button
                  onClick={() => {
                    setRoutingOpen(false)
                    navigate('/orders/routing-requests')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Routing Requests
                </button>
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
                <button
                  onClick={() => {
                    setReportsOpen(false)
                    navigate('/orders/shipping-log')
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Shipping Log
                </button>
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
              <h1 className="text-2xl font-bold text-gray-900">Order Lookup</h1>
              <p className="text-sm text-gray-600">Search and view order details</p>
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

          {/* Right side - Export File button and Records Per Page dropdown and Page Number dropdown */}
          <div className="flex flex-col items-end space-y-3">
            {/* Export File Button */}
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export File
            </button>

            {/* Records Per Page dropdown and Page Number dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="recordsPerPageTop" className="text-sm font-medium text-gray-700">Records Per Page:</label>
              <select
                id="recordsPerPageTop"
                value={recordsPerPage}
                onChange={(e) => handleRecordsPerPageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
              
              <label htmlFor="pageNumberTop" className="text-sm font-medium text-gray-700 ml-4">Page:</label>
              <select
                id="pageNumberTop"
                value={currentPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Section - Simplified to just two date fields */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Lookup Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="date"
                value={filterData.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="date"
                value={filterData.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Date Range Shortcuts */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {dateRangeOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleDateRangeClick(option.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  selectedDateRange === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Date Range Error */}
          {dateError && (
            <p className="mt-2 text-sm text-red-600">{dateError}</p>
          )}
          {/* Date Range Warning */}
          <p className="mt-3 text-sm text-red-600">
            🔴 <strong>Search date range limited to Today – 180 Days</strong>
          </p>
        </div>

        {/* Three Section Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Order Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Order Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship Date:</label>
                <input
                  type="date"
                  value={formData.shipDate}
                  onChange={(e) => handleFormChange('shipDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sys Order #:</label>
                <input
                  type="text"
                  value={formData.sysOrderNumber}
                  onChange={(e) => handleFormChange('sysOrderNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Boxes:</label>
                <input
                  type="number"
                  value={formData.numberOfBoxes}
                  onChange={(e) => handleFormChange('numberOfBoxes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand ID:</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => handleFormChange('brandId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Order #:</label>
                <input
                  type="text"
                  value={formData.clientOrderNumber}
                  onChange={(e) => handleFormChange('clientOrderNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 01:</label>
                <input
                  type="text"
                  value={formData.ref01}
                  onChange={(e) => handleFormChange('ref01', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer PO Number:</label>
                <input
                  type="text"
                  value={formData.customerPONumber}
                  onChange={(e) => handleFormChange('customerPONumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 02:</label>
                <input
                  type="text"
                  value={formData.ref02}
                  onChange={(e) => handleFormChange('ref02', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Box ID:</label>
                <input
                  type="text"
                  value={formData.boxId}
                  onChange={(e) => handleFormChange('boxId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 03:</label>
                <input
                  type="text"
                  value={formData.ref03}
                  onChange={(e) => handleFormChange('ref03', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking #:</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => handleFormChange('trackingNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 04:</label>
                <input
                  type="text"
                  value={formData.ref04}
                  onChange={(e) => handleFormChange('ref04', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel:</label>
                <select
                  value={formData.channel}
                  onChange={(e) => handleFormChange('channel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All Channels">All Channels</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 05:</label>
                <input
                  type="text"
                  value={formData.ref05}
                  onChange={(e) => handleFormChange('ref05', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ref 06:</label>
                <input
                  type="text"
                  value={formData.ref06}
                  onChange={(e) => handleFormChange('ref06', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Ship To Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Ship To Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Name1:</label>
                <input
                  type="text"
                  value={formData.shipToName1}
                  onChange={(e) => handleFormChange('shipToName1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Country:</label>
                <select
                  value={formData.shipToCountry}
                  onChange={(e) => handleFormChange('shipToCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All Countries">All Countries</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Email:</label>
                <input
                  type="email"
                  value={formData.shipToEmail}
                  onChange={(e) => handleFormChange('shipToEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Name2:</label>
                <input
                  type="text"
                  value={formData.shipToName2}
                  onChange={(e) => handleFormChange('shipToName2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province:</label>
                <input
                  type="text"
                  value={formData.stateProvince}
                  onChange={(e) => handleFormChange('stateProvince', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Tel:</label>
                <input
                  type="tel"
                  value={formData.shipToTel}
                  onChange={(e) => handleFormChange('shipToTel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Address1:</label>
                <input
                  type="text"
                  value={formData.shipToAddress1}
                  onChange={(e) => handleFormChange('shipToAddress1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To City:</label>
                <input
                  type="text"
                  value={formData.shipToCity}
                  onChange={(e) => handleFormChange('shipToCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer PO #:</label>
                <input
                  type="text"
                  value={formData.customerPO}
                  onChange={(e) => handleFormChange('customerPO', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Address2:</label>
                <input
                  type="text"
                  value={formData.shipToAddress2}
                  onChange={(e) => handleFormChange('shipToAddress2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ship To Zip:</label>
                <input
                  type="text"
                  value={formData.shipToZip}
                  onChange={(e) => handleFormChange('shipToZip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Billing Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Billing Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Type:</label>
                <select
                  value={formData.billToType}
                  onChange={(e) => handleFormChange('billToType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All Types">All Types</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Country:</label>
                <select
                  value={formData.billToCountry}
                  onChange={(e) => handleFormChange('billToCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All Countries">All Countries</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order COD:</label>
                <input
                  type="text"
                  value={formData.orderCOD}
                  onChange={(e) => handleFormChange('orderCOD', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Account Num:</label>
                <input
                  type="text"
                  value={formData.billToAccountNum}
                  onChange={(e) => handleFormChange('billToAccountNum', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To State:</label>
                <input
                  type="text"
                  value={formData.billToState}
                  onChange={(e) => handleFormChange('billToState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order COD Value:</label>
                <input
                  type="text"
                  value={formData.orderCODValue}
                  onChange={(e) => handleFormChange('orderCODValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Name1:</label>
                <input
                  type="text"
                  value={formData.billToName1}
                  onChange={(e) => handleFormChange('billToName1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To City:</label>
                <input
                  type="text"
                  value={formData.billToCity}
                  onChange={(e) => handleFormChange('billToCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order COD Req Cash MO:</label>
                <select
                  value={formData.orderCODReqCashMO}
                  onChange={(e) => handleFormChange('orderCODReqCashMO', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Name2:</label>
                <input
                  type="text"
                  value={formData.billToName2}
                  onChange={(e) => handleFormChange('billToName2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Zip:</label>
                <input
                  type="text"
                  value={formData.billToZip}
                  onChange={(e) => handleFormChange('billToZip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order COD Add Ship Cost:</label>
                <select
                  value={formData.orderCODAddShipCost}
                  onChange={(e) => handleFormChange('orderCODAddShipCost', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Address1:</label>
                <input
                  type="text"
                  value={formData.billToAddress1}
                  onChange={(e) => handleFormChange('billToAddress1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill To Tel:</label>
                <input
                  type="tel"
                  value={formData.billToTel}
                  onChange={(e) => handleFormChange('billToTel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address 2:</label>
                <input
                  type="text"
                  value={formData.billingAddress2}
                  onChange={(e) => handleFormChange('billingAddress2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Clear Search
          </button>
          <button
            onClick={handleShowResults}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Show Results
          </button>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>No records found for the specified criteria.</span>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(salesOrderPipelineOpen || routingOpen || reportsOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setSalesOrderPipelineOpen(false)
            setRoutingOpen(false)
            setReportsOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default OrderLookup 