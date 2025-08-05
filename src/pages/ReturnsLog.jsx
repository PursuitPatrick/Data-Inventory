import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowLeft, Download } from 'lucide-react'

const ReturnsLog = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [returnOrdersOpen, setReturnOrdersOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)

  // Filter states
  const [filterData, setFilterData] = useState({
    brandId: 'MAGM - MAGM LLC',
    warehouseId: 'All Warehouses',
    carriers: 'All Carriers',
    skuDropdown: '',
    fromDate: '2025-08-05',
    toDate: '2025-08-05'
  })

  // Date range state
  const [selectedDateRange, setSelectedDateRange] = useState('Today')

  // Records per page state
  const [recordsPerPage, setRecordsPerPage] = useState(25)

  // Current page state
  const [currentPage, setCurrentPage] = useState(1)

  // Dropdown options
  const returnOrdersOptions = [
    { label: 'Manage Returns', path: '/returns' },
    { label: 'Create Return', path: '/returns/create' }
  ]

  const reportsOptions = [
    { label: 'Returns Log', path: '/returns/log' }
  ]

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6">
      {/* Dropdowns Container */}
      <div className="mb-4 flex space-x-4">
        {/* Return Orders Dropdown */}
        <div className="relative">
          <button
            onClick={() => setReturnOrdersOpen(!returnOrdersOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Return Orders</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${returnOrdersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {returnOrdersOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {returnOrdersOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setReturnOrdersOpen(false)
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
                      option.label === 'Returns Log' 
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
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Returns Log</h1>
              <p className="text-sm text-gray-600">View and track all return activities</p>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => console.log('Export file clicked')}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-1" />
              Export File
            </button>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {/* Filter Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Returns Log Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Brand ID */}
            <div>
              <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-2">Brand ID</label>
              <select
                id="brandId"
                value={filterData.brandId}
                onChange={(e) => handleFilterChange('brandId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select brand ID"
              >
                <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
                <option value="BRAND-001 - WestCo Distribution">BRAND-001 - WestCo Distribution</option>
                <option value="BRAND-002 - Metro Supplies">BRAND-002 - Metro Supplies</option>
              </select>
            </div>

            {/* Warehouse ID */}
            <div>
              <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-2">Warehouse ID</label>
              <select
                id="warehouseId"
                value={filterData.warehouseId}
                onChange={(e) => handleFilterChange('warehouseId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select warehouse ID"
              >
                <option value="All Warehouses">All Warehouses</option>
                <option value="WH-001 - Fort Lauderdale">WH-001 - Fort Lauderdale</option>
                <option value="WH-002 - Bronx, NY">WH-002 - Bronx, NY</option>
                <option value="WH-003 - Los Angeles">WH-003 - Los Angeles</option>
              </select>
            </div>

            {/* Carriers */}
            <div>
              <label htmlFor="carriers" className="block text-sm font-medium text-gray-700 mb-2">Carriers</label>
              <select
                id="carriers"
                value={filterData.carriers}
                onChange={(e) => handleFilterChange('carriers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select carriers"
              >
                <option value="All Carriers">All Carriers</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
              </select>
            </div>

            {/* SKU Dropdown */}
            <div>
              <label htmlFor="skuDropdown" className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <select
                id="skuDropdown"
                value={filterData.skuDropdown || ''}
                onChange={(e) => handleFilterChange('skuDropdown', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select SKU"
              >
                <option value="">Select SKU</option>
                <option value="BREAK X1">BREAK X1</option>
                <option value="BREAK X2">BREAK X2</option>
                <option value="MAGM">MAGM</option>
                <option value="SHELL S1">SHELL S1</option>
                <option value="SHELL S2">SHELL S2</option>
                <option value="SHELL S3">SHELL S3</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                id="fromDate"
                type="date"
                value={filterData.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select from date"
              />
            </div>

            {/* To Date */}
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                id="toDate"
                type="date"
                value={filterData.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select to date"
              />
            </div>
          </div>

          {/* Show Results Button */}
          <div className="mt-4">
            <button
              onClick={() => console.log('Show Results clicked')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
              aria-label="Show filtered results"
            >
              Show Results
            </button>
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
        </div>

        {/* Records Per Page Dropdown */}
        <div className="flex justify-end mb-4 space-x-4">
          <select
            id="recordsPerPage"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={25}>25 records Per Page</option>
            <option value={50}>50 records Per Page</option>
            <option value={100}>100 records Per Page</option>
            <option value={250}>250 records Per Page</option>
          </select>
          
          <select
            id="currentPage"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        {/* Column Headers */}
        <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] text-sm font-medium">
          <div>Date Received</div>
          <div>Sys #</div>
          <div>RMA #</div>
          <div>Client ID</div>
          <div>DC</div>
          <div>Name</div>
          <div>Address</div>
          <div>Email</div>
          <div>Carrier</div>
          <div>Lines</div>
          <div>Total Qty</div>
          <div>REC Qty</div>
          <div>DMG Qty</div>
          <div>Loc</div>
          <div>Zone</div>
          <div>Condition</div>
          <div>Desc</div>
        </div>
      </div>
    </div>
  )
}

export default ReturnsLog 