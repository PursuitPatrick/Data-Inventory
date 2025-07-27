import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const POLookup = () => {
  const navigate = useNavigate()
  
  // State for form data
  const [formData, setFormData] = useState({
    sysPo: '',
    fromDate: '',
    carriers: '',
    clientPo: '',
    toDate: '',
    rushPo: '',
    clientId: '',
    expTrackingNo: '',
    poStatus: '',
    sku: '',
    dc: '',
    trackingNo: ''
  })
  
  // State for date range shortcuts
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [dateError, setDateError] = useState('')
  
  // State for notification
  const [showNotification, setShowNotification] = useState(false)

  // State for records per page
  const [recordsPerPage, setRecordsPerPage] = useState(25)

  // Date range shortcut options
  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'this-week', label: 'This Week' },
    { id: 'last-week', label: 'Last Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'custom', label: 'Custom Dates' }
  ]

  // Handler for records per page dropdown
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value))
  }

  // Function to calculate date ranges
  const calculateDateRange = (rangeType) => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (rangeType) {
      case 'today':
        return { from: todayStr, to: todayStr }
      
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        return { from: yesterdayStr, to: yesterdayStr }
      
      case 'this-week':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfWeekStr = startOfWeek.toISOString().split('T')[0]
        return { from: startOfWeekStr, to: todayStr }
      
      case 'last-week':
        const lastWeekStart = new Date(today)
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        const lastWeekStartStr = lastWeekStart.toISOString().split('T')[0]
        const lastWeekEndStr = lastWeekEnd.toISOString().split('T')[0]
        return { from: lastWeekStartStr, to: lastWeekEndStr }
      
      case 'this-month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const startOfMonthStr = startOfMonth.toISOString().split('T')[0]
        return { from: startOfMonthStr, to: todayStr }
      
      case 'last-month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        const lastMonthStartStr = lastMonthStart.toISOString().split('T')[0]
        const lastMonthEndStr = lastMonthEnd.toISOString().split('T')[0]
        return { from: lastMonthStartStr, to: lastMonthEndStr }
      
      default:
        return { from: '', to: '' }
    }
  }

  // Function to validate date range (180 days limit)
  const validateDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return true
    
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const today = new Date()
    const minDate = new Date(today)
    minDate.setDate(today.getDate() - 180)
    
    if (from < minDate || to < minDate) {
      setDateError('Date range cannot be more than 180 days in the past')
      return false
    }
    
    if (from > to) {
      setDateError('From date cannot be after To date')
      return false
    }
    
    setDateError('')
    return true
  }

  // Function to handle date range shortcut clicks
  const handleDateRangeClick = (rangeType) => {
    if (rangeType === 'custom') {
      setSelectedDateRange('custom')
      setDateError('')
      return
    }
    
    const { from, to } = calculateDateRange(rangeType)
    
    if (validateDateRange(from, to)) {
      setFormData(prev => ({
        ...prev,
        fromDate: from,
        toDate: to
      }))
      setSelectedDateRange(rangeType)
    }
  }

  // Function to handle manual date changes
  const handleDateChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: value
    }
    
    setFormData(newFormData)
    
    // Validate if both dates are set
    if (newFormData.fromDate && newFormData.toDate) {
      validateDateRange(newFormData.fromDate, newFormData.toDate)
    } else {
      setDateError('')
    }
    
    // Clear selected range if manually editing
    if (selectedDateRange !== 'custom') {
      setSelectedDateRange('')
    }
  }

  // Ensure dropdowns always open downward
  useEffect(() => {
    const enforceDropdownDirection = () => {
      const selects = document.querySelectorAll('select')
      selects.forEach(select => {
        // Force direction to ltr
        select.style.direction = 'ltr'
        
        // Add event listeners to prevent upward expansion
        select.addEventListener('focus', (e) => {
          e.target.style.direction = 'ltr'
          e.target.style.transform = 'none'
          e.target.style.top = '100%'
          e.target.style.bottom = 'auto'
        })
        
        select.addEventListener('click', (e) => {
          e.target.style.direction = 'ltr'
          e.target.style.transform = 'none'
          e.target.style.top = '100%'
          e.target.style.bottom = 'auto'
        })
      })
    }

    enforceDropdownDirection()
    
    // Re-apply on any DOM changes
    const observer = new MutationObserver(enforceDropdownDirection)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>
        {`
          select {
            direction: ltr !important;
          }
          select option {
            direction: ltr !important;
          }
          /* Force dropdowns to open downward */
          select:focus {
            direction: ltr !important;
          }
          /* Additional CSS to ensure downward expansion */
          select {
            transform-origin: top !important;
          }
          /* Override any auto-placement that might cause upward expansion */
          select:focus {
            transform: none !important;
          }
        `}
      </style>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PO Lookup</h1>
              <p className="text-sm text-gray-600">Search and view purchase order details</p>
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

          {/* Right side - Records Per Page Dropdown */}
          <div className="flex items-center">
            <label className="text-xs font-medium text-gray-700 mr-2">Records Per Page</label>
            <select
              value={recordsPerPage}
              onChange={e => handleRecordsPerPageChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
            >
              <option value={25}>25 Records Per Page</option>
              <option value={50}>50 Records Per Page</option>
              <option value={100}>100 Records Per Page</option>
              <option value={250}>250 Records Per Page</option>
            </select>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">PO Search Filters</h2>
          
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Sys PO # */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sys PO #</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Sys PO #"
              />
            </div>

            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => handleDateChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Carriers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Carriers</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">All Carriers</option>
                <option value="dhl">DHL</option>
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
              </select>
            </div>

            {/* Client PO # */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client PO #</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Client PO #"
              />
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => handleDateChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rush PO */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rush PO</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Client ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">All Clients</option>
                <option value="CLI-001">CLI-001 – WestCo Distribution</option>
                <option value="CLI-002">CLI-002 – Metro Supplies</option>
              </select>
            </div>

            {/* Exp Tracking No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exp Tracking No</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Exp Tracking No"
              />
            </div>

            {/* PO Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PO Status</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">All Statuses</option>
                <option value="on-hold">On Hold</option>
                <option value="being-edited">Being Edited</option>
                <option value="expected">Expected</option>
                <option value="arrived">Arrived</option>
                <option value="being-put-away">Being Put Away</option>
                <option value="being-verified">Being Verified</option>
                <option value="received">Received</option>
              </select>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">Select SKU</option>
                <option value="break-x1">BREAK X1</option>
                <option value="break-x2">BREAK X2</option>
                <option value="magm">MAGM</option>
                <option value="shell-s1">SHELL S1</option>
                <option value="shell-s2">SHELL S2</option>
              </select>
            </div>

            {/* DC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">DC</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                style={{ direction: 'ltr' }}
                data-dropdown-direction="down"
              >
                <option value="">All DCs</option>
                <option value="fort-lauderdale">Fort Lauderdale, Florida</option>
                <option value="bronx">Bronx, NY</option>
              </select>
            </div>

            {/* Tracking No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tracking No</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Tracking No"
              />
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

          {/* Submit Results Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                console.log('Submit Results clicked')
                console.log('Form data:', formData)
                console.log('Selected date range:', selectedDateRange)
                // Mock search functionality - can be expanded later
                // Simulate no results found
                setShowNotification(true)
                // Auto-dismiss after 4 seconds
                setTimeout(() => {
                  setShowNotification(false)
                }, 4000)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Submit Results
            </button>
          </div>

          {/* Results Table Header */}
          <div className="mt-6">
            <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-12 text-sm font-medium">
              <div>Sys #</div>
              <div>PO</div>
              <div>Client ID</div>
              <div>DC</div>
              <div>Carrier</div>
              <div>Lines</div>
              <div>Total Exp</div>
              <div>Total Arr</div>
              <div>Total Good</div>
              <div>Total Damaged</div>
              <div>Status</div>
              <div>Last Update</div>
            </div>
            {/* Table rows would go here */}
            <div className="flex justify-end items-center mt-2">
              <label className="text-xs font-medium text-gray-700 mr-2">Records Per Page</label>
              <select
                value={recordsPerPage}
                onChange={e => handleRecordsPerPageChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
              >
                <option value={25}>25 Records Per Page</option>
                <option value={50}>50 Records Per Page</option>
                <option value={100}>100 Records Per Page</option>
                <option value={250}>250 Records Per Page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3">
            <div className="text-sm text-gray-700 font-medium">
              No Record Found
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default POLookup 