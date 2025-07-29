import { useState } from 'react'
import { ArrowLeft, Download, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StockActivity = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [inventoryPipelineOpen, setInventoryPipelineOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  // State for filter data
  const [filterData, setFilterData] = useState({
    clientId: 'MAGM - MAGM LLC',
    dc: 'All Warehouses',
    sku: '',
    fromDate: '07-27-2025',
    toDate: '07-27-2025'
  })

  // State for date range shortcuts
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [dateError, setDateError] = useState('')

  // Dropdown options
  const inventoryPipelineOptions = [
    { label: 'Manage Inventory', path: '/inventory/warehouse/manage-inventory' },
    { label: 'Inventory Bundles', path: '/inventory/warehouse/inventory-bundles' },
    { label: 'Inventory Kits', path: '/inventory/warehouse/inventory-kits' },
    { label: 'Inventory By Expiration', path: '/inventory/warehouse/inventory-by-expiration' },
    { label: 'Inventory By Serial #', path: '/inventory/warehouse/inventory-by-serial' }
  ]

  const warehouseOptions = [
    { label: 'Warehouse A', path: '/warehouse/a' },
    { label: 'Warehouse B', path: '/warehouse/b' },
    { label: 'Warehouse C', path: '/warehouse/c' }
  ]

  const reportsOptions = [
    { label: 'Stock Activity', path: '/inventory/reports/stock-activity' },
    { label: 'Move Log', path: '/inventory/reports/move-log' },
    { label: 'Inventory Log - Value', path: '/inventory/reports/inventory-log-value' },
    { label: 'Inventory Snap', path: '/inventory/reports/inventory-snap' }
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
      sku: '',
      fromDate: '07-27-2025',
      toDate: '07-27-2025'
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
        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
        return { 
          from: startOfWeek.toISOString().split('T')[0], 
          to: endOfWeek.toISOString().split('T')[0] 
        }
      case 'lastWeek':
        const startOfLastWeek = new Date(today)
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7)
        const endOfLastWeek = new Date(today)
        endOfLastWeek.setDate(today.getDate() - today.getDay() - 1)
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
      default:
        return { from: todayStr, to: todayStr }
    }
  }

  // Validate date range
  const validateDateRange = (fromDate, toDate) => {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() - 180) // 180 days ago

    if (from > to) {
      return 'From date cannot be after To date'
    }

    if (from > today) {
      return 'From date cannot be in the future'
    }

    if (to > today) {
      return 'To date cannot be in the future'
    }

    if (from < maxDate) {
      return 'From date cannot be more than 180 days ago'
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
        {/* Inventory Pipeline Dropdown */}
        <div className="relative">
          <button
            onClick={() => setInventoryPipelineOpen(!inventoryPipelineOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Inventory Pipeline</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${inventoryPipelineOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {inventoryPipelineOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {inventoryPipelineOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInventoryPipelineOpen(false)
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

        {/* Warehouse Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWarehouseOpen(!warehouseOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Warehouse</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${warehouseOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {warehouseOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {warehouseOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setWarehouseOpen(false)
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
            <h1 className="text-2xl font-bold text-gray-900">SKU Activity</h1>
            <p className="text-sm text-gray-600">View and manage SKU activity logs</p>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Activity Filters</h2>
        
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

      {/* Show Results and Clear Search Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          type="button"
          onClick={handleShowResults}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Show Results
        </button>
        <button
          type="button"
          onClick={handleClearSearch}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
        >
          Clear Search
        </button>
      </div>

      {/* Results Header Row */}
      <div className="mt-6">
        <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-6 text-sm font-medium">
          <div>DC</div>
          <div>Date</div>
          <div>User</div>
          <div>Description</div>
          <div>Change</div>
          <div>New Balance</div>
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
          <p className="text-lg font-medium mb-2">Stock Activity Results</p>
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
    </div>
  )
}

export default StockActivity 