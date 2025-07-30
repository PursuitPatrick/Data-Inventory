import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Download, Plus, ArrowLeft } from 'lucide-react'

const ManageReturns = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [returnOrdersOpen, setReturnOrdersOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  const [placeholderOpen, setPlaceholderOpen] = useState(false)
  
  // Table states
  const [activeTab, setActiveTab] = useState('Pending')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for returns
  const mockReturns = [
    {
      id: 1,
      sysNumber: 'SYS001',
      retailer: 'Amazon',
      returnNumber: 'RET-2024-001',
      dc: 'DC-A',
      clientId: 'CLIENT001',
      lines: 3,
      qty: 15,
      weight: '8.5 lbs',
      returnMethod: 'Standard',
      lastUpdate: '2024-01-15',
      status: 'Pending'
    },
    {
      id: 2,
      sysNumber: 'SYS002',
      retailer: 'Walmart',
      returnNumber: 'RET-2024-002',
      dc: 'DC-B',
      clientId: 'CLIENT002',
      lines: 2,
      qty: 8,
      weight: '4.2 lbs',
      returnMethod: 'Express',
      lastUpdate: '2024-01-14',
      status: 'In Process'
    },
    {
      id: 3,
      sysNumber: 'SYS003',
      retailer: 'Target',
      returnNumber: 'RET-2024-003',
      dc: 'DC-A',
      clientId: 'CLIENT003',
      lines: 5,
      qty: 22,
      weight: '12.1 lbs',
      returnMethod: 'Standard',
      lastUpdate: '2024-01-13',
      status: 'Completed'
    },
    {
      id: 4,
      sysNumber: 'SYS004',
      retailer: 'Best Buy',
      returnNumber: 'RET-2024-004',
      dc: 'DC-C',
      clientId: 'CLIENT004',
      lines: 1,
      qty: 3,
      weight: '2.8 lbs',
      returnMethod: 'Express',
      lastUpdate: '2024-01-12',
      status: 'Ready to Process'
    },
    {
      id: 5,
      sysNumber: 'SYS005',
      retailer: 'Home Depot',
      returnNumber: 'RET-2024-005',
      dc: 'DC-B',
      clientId: 'CLIENT005',
      lines: 4,
      qty: 12,
      weight: '7.7 lbs',
      returnMethod: 'Standard',
      lastUpdate: '2024-01-11',
      status: 'Pending'
    },
    {
      id: 6,
      sysNumber: 'SYS006',
      retailer: 'Costco',
      returnNumber: 'RET-2024-006',
      dc: 'DC-A',
      clientId: 'CLIENT006',
      lines: 2,
      qty: 6,
      weight: '3.5 lbs',
      returnMethod: 'Express',
      lastUpdate: '2024-01-10',
      status: 'In Process'
    }
  ]

  // Dropdown options
  const returnOrdersOptions = [
    { label: 'Create Return', path: '/returns/create' },
    { label: 'Return Lookup', path: '/returns/lookup' }
  ]

  const reportsOptions = [
    { label: 'Return Reports', path: '/returns/reports' }
  ]

  const placeholderOptions = []

  // Tabs
  const tabs = [
    { id: 'Pending', label: 'Pending' },
    { id: 'In Process', label: 'In Process' },
    { id: 'Ready to Process', label: 'Ready to Process' },
    { id: 'Completed', label: 'Completed' }
  ]

  const getFilteredReturns = () => {
    let filtered = mockReturns

    // Filter by active tab
    filtered = filtered.filter(returnItem => returnItem.status === activeTab)

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(returnItem =>
        returnItem.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.retailer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.sysNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getTabCount = (tabId) => {
    return mockReturns.filter(returnItem => returnItem.status === tabId).length
  }

  const getPaginatedReturns = () => {
    const filtered = getFilteredReturns()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredReturns().length / recordsPerPage)
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
      'Sys #', 'Retailer', 'Return #', 'DC', 'Client ID', 'Lines', 'Qty', 'Weight', 'Return Method', 'Last Update', 'Status'
    ]

    const data = getFilteredReturns().map(returnItem => [
      returnItem.sysNumber || '',
      returnItem.retailer || '',
      returnItem.returnNumber || '',
      returnItem.dc || '',
      returnItem.clientId || '',
      returnItem.lines || 0,
      returnItem.qty || 0,
      returnItem.weight || '',
      returnItem.returnMethod || '',
      returnItem.lastUpdate ? new Date(returnItem.lastUpdate).toLocaleDateString() : '',
      returnItem.status || ''
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `returns_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`)
    link.click()
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
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Placeholder Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPlaceholderOpen(!placeholderOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Placeholder</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${placeholderOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {placeholderOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {placeholderOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPlaceholderOpen(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Returns</h1>
              <p className="text-sm text-gray-600">View and manage all returns</p>
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
          
          {/* Right side - Returns counter and buttons */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Showing {getPaginatedReturns().length} of {getFilteredReturns().length} returns
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
                onClick={() => navigate('/returns/create')}
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
                placeholder="Search by Return Number, Client ID, or Retailer"
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
          <div className="flex-1 min-w-0 px-1">Return #</div>
          <div className="flex-1 min-w-0 px-1">DC</div>
          <div className="flex-1 min-w-0 px-1">Client ID</div>
          <div className="flex-1 min-w-0 px-1">Lines</div>
          <div className="flex-1 min-w-0 px-1">Qty</div>
          <div className="flex-1 min-w-0 px-1">Weight</div>
          <div className="flex-1 min-w-0 px-1">Return Method</div>
          <div className="flex-1 min-w-0 px-1">Last Update</div>
          <div className="flex-1 min-w-0 px-1">Status</div>
          <div className="flex-1 min-w-0 px-1">Action</div>
        </div>

        {/* Returns Rows */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getPaginatedReturns().map((returnItem) => (
            <div key={returnItem.id} className="flex items-center border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
              <div className="flex items-center pl-2 w-8">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 px-1">{returnItem.sysNumber}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.retailer}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.returnNumber}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.dc}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.clientId}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.lines}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.qty}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.weight}</div>
              <div className="flex-1 min-w-0 px-1">{returnItem.returnMethod}</div>
              <div className="flex-1 min-w-0 px-1 text-xs">
                {new Date(returnItem.lastUpdate).toLocaleDateString()}
              </div>
              <div className="flex-1 min-w-0 px-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  returnItem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  returnItem.status === 'Ready to Process' ? 'bg-blue-100 text-blue-800' :
                  returnItem.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' :
                  returnItem.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {returnItem.status}
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

        {/* Process Returns Button */}
        <div className="mt-3">
          <button
            onClick={() => console.log("Process selected returns")}
            className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Process Returns
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageReturns 