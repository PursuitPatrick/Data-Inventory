import { useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ReceivingLog = () => {
  const navigate = useNavigate()
  
  // State for filter data
  const [filterData, setFilterData] = useState({
    clientId: 'MAGM - MAGM LLC',
    dc: 'All Warehouses',
    carriers: 'All Carriers',
    sku: '',
    fromDate: '07-27-2025',
    toDate: '07-27-2025'
  })

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
    setDateError('')
    return true
  }

  // Handle date range click
  const handleDateRangeClick = (rangeId) => {
    setSelectedDateRange(rangeId)
    
    if (rangeId === 'custom') {
      // For custom dates, don't auto-populate - let user select manually
      return
    }
    
    const { from, to } = calculateDateRange(rangeId)
    
    if (validateDateRange(from, to)) {
      setFilterData(prev => ({
        ...prev,
        fromDate: from,
        toDate: to
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left side - Title */}
        <div className="flex flex-col">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Receiving Log</h1>
            <p className="text-sm text-gray-600">View and manage receiving activity logs</p>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Receiving Log Filters</h2>
        
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

          {/* Carriers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carriers</label>
            <select
              value={filterData.carriers}
              onChange={(e) => handleFilterChange('carriers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Carriers">All Carriers</option>
              <option value="UPS - UPS (United Parcel Service)">UPS - UPS (United Parcel Service)</option>
              <option value="FDXG - FEDEX (FedEx Ground)">FDXG - FEDEX (FedEx Ground)</option>
              <option value="FDXE - (FedEx Express)">FDXE - (FedEx Express)</option>
              <option value="FDXSMARTPOST - FedEx SmartPost">FDXSMARTPOST - FedEx SmartPost</option>
              <option value="DHLE - DHL eCommerce">DHLE - DHL eCommerce</option>
              <option value="LTL - LTL (Less-Than-Truckload)">LTL - LTL (Less-Than-Truckload)</option>
              <option value="PUROLATOR - Purolator">PUROLATOR - Purolator</option>
              <option value="REWORK - REWORK">REWORK - REWORK</option>
              <option value="TBR - To Be Routed">TBR - To Be Routed</option>
              <option value="UPSSP - UPS SurePost">UPSSP - UPS SurePost</option>
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <select
              value={filterData.sku}
              onChange={(e) => handleFilterChange('sku', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select SKU</option>
              <option value="BREAK X1">BREAK X1</option>
              <option value="BREAK X2">BREAK X2</option>
              <option value="MAGM">MAGM</option>
              <option value="SHELL S1">SHELL S1</option>
              <option value="SHELL S2">SHELL S2</option>
            </select>
          </div>

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
        
        {/* Date Range Warning */}
        <p className="mt-3 text-sm text-red-600">
          🔴 <strong>Search date range limited to Today – 180 Days</strong>
        </p>
        
        {/* Date Range Error */}
        {dateError && (
          <p className="mt-2 text-sm text-red-600">{dateError}</p>
        )}
      </div>

      {/* Show Results Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleShowResults}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Show Results
        </button>
      </div>

      {/* Results Header Row */}
      <div className="mt-6">
        <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-9 text-sm font-medium">
          <div>Show Results</div>
          <div>Date Received</div>
          <div>Sys PO #</div>
          <div>Client PO #</div>
          <div>Client ID</div>
          <div>DC</div>
          <div>Carrier</div>
          <div>Total Qty</div>
          <div>Lines</div>
        </div>
      </div>

      {/* Bottom Records Per Page Dropdown */}
      <div className="mt-4 flex justify-end">
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
          
          <label htmlFor="pageNumberBottom" className="text-sm font-medium text-gray-700 ml-4">Page:</label>
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

      {/* Content Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Receiving Log Results</p>
          <p className="text-sm">Filtered results will be displayed here.</p>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-lg z-50 fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">No Record Found</span>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceivingLog 