import { useState } from 'react'
import { ArrowLeft, Download, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const OrderLookup = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [salesOrderPipelineOpen, setSalesOrderPipelineOpen] = useState(false)
  const [routingOpen, setRoutingOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  // State for filter data
  const [filterData, setFilterData] = useState({
    clientId: 'MAGM - MAGM LLC',
    dc: 'All Warehouses',
    orderNumber: '',
    fromDate: '07-27-2025',
    toDate: '07-27-2025'
  })

  // State for date range shortcuts
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [dateError, setDateError] = useState('')

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
      clientId: 'MAGM - MAGM LLC',
      dc: 'All Warehouses',
      orderNumber: '',
      fromDate: '07-27-2025',
      toDate: '07-27-2025'
    })
    setSelectedDateRange('')
    setDateError('')
    setCurrentPage(1)
  }

  // Handle export
  const handleExport = () => {
    console.log('Export clicked')
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order Number,Client ID,DC,Date,Status\n" +
      "ORD-001,MAGM - MAGM LLC,Fort Lauderdale,2025-07-27,Pending\n"
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "order_lookup_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate date range for shortcuts
  const calculateDateRange = (rangeType) => {
    const today = new Date()
    const from = new Date()
    const to = new Date()

    switch (rangeType) {
      case 'today':
        return {
          from: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      case 'yesterday':
        from.setDate(today.getDate() - 1)
        to.setDate(today.getDate() - 1)
        return {
          from: from.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: to.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      case 'last7days':
        from.setDate(today.getDate() - 7)
        return {
          from: from.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      case 'last30days':
        from.setDate(today.getDate() - 30)
        return {
          from: from.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      case 'thisMonth':
        from.setDate(1)
        return {
          from: from.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      case 'lastMonth':
        from.setMonth(today.getMonth() - 1)
        from.setDate(1)
        to.setDate(0) // Last day of previous month
        return {
          from: from.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: to.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
      default:
        return {
          from: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
          to: today.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        }
    }
  }

  // Validate date range
  const validateDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
      return 'Both from and to dates are required'
    }

    const from = new Date(fromDate)
    const to = new Date(toDate)

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return 'Invalid date format'
    }

    if (from > to) {
      return 'From date cannot be after to date'
    }

    return null
  }

  // Handle date range click
  const handleDateRangeClick = (rangeId) => {
    setSelectedDateRange(rangeId)
    setDateError('')

    if (rangeId === 'custom') {
      // Don't auto-fill dates for custom
      return
    }

    const { from, to } = calculateDateRange(rangeId)
    setFilterData(prev => ({
      ...prev,
      fromDate: from,
      toDate: to
    }))
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
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
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

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Lookup Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
            <select
              value={filterData.clientId}
              onChange={(e) => handleFilterChange('clientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
              <option value="CLI-001 - WestCo Distribution">CLI-001 - WestCo Distribution</option>
              <option value="CLI-002 - Metro Supplies">CLI-002 - Metro Supplies</option>
            </select>
          </div>

          {/* DC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DC</label>
            <select
              value={filterData.dc}
              onChange={(e) => handleFilterChange('dc', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Warehouses">All Warehouses</option>
              <option value="Fort Lauderdale, Florida">Fort Lauderdale, Florida</option>
              <option value="Bronx, NY">Bronx, NY</option>
            </select>
          </div>

          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
            <input
              type="text"
              value={filterData.orderNumber}
              onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
              placeholder="Enter order number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="text"
              value={filterData.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              placeholder="MM-DD-YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="text"
              value={filterData.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
              placeholder="MM-DD-YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Date Range Shortcuts */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Date Ranges:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'last7days', label: 'Last 7 Days' },
              { id: 'last30days', label: 'Last 30 Days' },
              { id: 'thisMonth', label: 'This Month' },
              { id: 'lastMonth', label: 'Last Month' },
              { id: 'custom', label: 'Custom Range' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => handleDateRangeClick(range.id)}
                className={`px-3 py-1 text-sm rounded-md border transition-colors duration-200 ${
                  selectedDateRange === range.id
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          {dateError && (
            <p className="text-red-600 text-sm mt-2">{dateError}</p>
          )}
        </div>

        {/* Warning Message */}
        <div className="mt-6 bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2">
          <span>⚠️</span>
          <span>Please enter the search criteria to find orders.</span>
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
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="bg-gray-900 text-white px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium">
            <div className="col-span-2">Order Number</div>
            <div className="col-span-2">Client ID</div>
            <div className="col-span-2">DC</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Action</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="p-6 text-center text-gray-500">
          <p>No records found. Please adjust your search criteria and try again.</p>
        </div>
      </div>

      {/* Bottom Records Per Page and Page Number */}
      <div className="flex justify-end items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="recordsPerPageBottom" className="text-sm font-medium text-gray-700">Records Per Page:</label>
          <select
            id="recordsPerPageBottom"
            value={recordsPerPage}
            onChange={(e) => handleRecordsPerPageChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="pageNumberBottom" className="text-sm font-medium text-gray-700">Page:</label>
          <select
            id="pageNumberBottom"
            value={currentPage}
            onChange={(e) => handlePageChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1</option>
          </select>
        </div>
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
  )
}

export default OrderLookup 