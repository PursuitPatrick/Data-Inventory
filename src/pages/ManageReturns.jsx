import { useState } from 'react'
import { Download, Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateWithDay } from '../utils/dateUtils'

// Mock data for returns
const mockReturns = [
  {
    id: 'RET-001',
    returnNumber: 'RET-2024-001',
    clientId: 'ClientA',
    customerName: 'John Doe',
    originalOrder: 'ORD-2024-001',
    returnReason: 'Defective Product',
    lastUpdate: '2025-01-26T00:00:00Z',
    status: 'Pending',
    priority: 'High',
    refundAmount: 1250.00
  },
  {
    id: 'RET-002',
    returnNumber: 'RET-2024-002',
    clientId: 'ClientB',
    customerName: 'Jane Smith',
    originalOrder: 'ORD-2024-002',
    returnReason: 'Wrong Size',
    lastUpdate: '2025-01-25T00:00:00Z',
    status: 'Approved',
    priority: 'Medium',
    refundAmount: 850.50
  },
  {
    id: 'RET-003',
    returnNumber: 'RET-2024-003',
    clientId: 'ClientC',
    customerName: 'Bob Johnson',
    originalOrder: 'ORD-2024-003',
    returnReason: 'Not as Described',
    lastUpdate: '2025-01-24T00:00:00Z',
    status: 'Completed',
    priority: 'Low',
    refundAmount: 2100.75
  },
  {
    id: 'RET-004',
    returnNumber: 'RET-2024-004',
    clientId: 'ClientA',
    customerName: 'Alice Brown',
    originalOrder: 'ORD-2024-004',
    returnReason: 'Changed Mind',
    lastUpdate: '2025-01-23T00:00:00Z',
    status: 'Rejected',
    priority: 'High',
    refundAmount: 675.25
  },
  {
    id: 'RET-005',
    returnNumber: 'RET-2024-005',
    clientId: 'ClientD',
    customerName: 'Charlie Wilson',
    originalOrder: 'ORD-2024-005',
    returnReason: 'Damaged in Transit',
    lastUpdate: '2025-01-22T00:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    refundAmount: 1890.00
  }
]

const ManageReturns = () => {
  const [activeTab, setActiveTab] = useState('Pending')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const tabs = [
    { id: 'Pending', label: 'Pending' },
    { id: 'Approved', label: 'Approved' },
    { id: 'Rejected', label: 'Rejected' },
    { id: 'Completed', label: 'Completed' },
    { id: 'ALL Returns', label: 'ALL Returns' }
  ]

  // Filter returns based on active tab
  const getFilteredReturns = () => {
    if (activeTab === 'ALL Returns') {
      return mockReturns
    }
    return mockReturns.filter(returnItem => returnItem.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL Returns') {
      return mockReturns.length
    }
    return mockReturns.filter(returnItem => returnItem.status === tabId).length
  }

  // Pagination functions
  const getPaginatedReturns = () => {
    const filteredReturns = getFilteredReturns()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredReturns.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredReturns = getFilteredReturns()
    return Math.ceil(filteredReturns.length / recordsPerPage)
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when changing records per page
  }

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value))
  }

  // Handle search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      console.log('Search term is empty')
      return
    }

    const searchValue = searchTerm.trim().toLowerCase()
    
    // Search in the current dataset
    const foundReturn = mockReturns.find(returnItem => {
      // Search by Return Number
      if (returnItem.returnNumber.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Client ID
      if (returnItem.clientId.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Customer Name
      if (returnItem.customerName.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Date (formatted as MM/DD/YYYY)
      const formattedDate = formatDateWithDay(returnItem.lastUpdate)
      if (formattedDate.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundReturn) {
      navigate(`/returns/details/${foundReturn.id}`) // Placeholder route
    } else {
      alert('No return found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const headers = ['Return ID', 'Return Number', 'Client ID', 'Customer Name', 'Original Order', 'Return Reason', 'Status', 'Priority', 'Refund Amount', 'Last Update']
    const data = getFilteredReturns().map(returnItem => [
      returnItem.id,
      returnItem.returnNumber,
      returnItem.clientId,
      returnItem.customerName,
      returnItem.originalOrder,
      returnItem.returnReason,
      returnItem.status,
      returnItem.priority,
      returnItem.refundAmount.toFixed(2),
      formatDateWithDay(returnItem.lastUpdate)
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `returns_export_${formatDateWithDay(new Date()).replace(/\//g, '-')}.csv`)
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left side - Title */}
        <div className="flex flex-col">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Returns</h1>
            <p className="text-sm text-gray-600">View and manage all customer returns</p>
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
              placeholder="Search by Return Number, Client ID, or Customer Name"
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
      <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-10 text-sm font-medium">
        <div className="flex items-center pl-2">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div>Return ID</div>
        <div>Return Number</div>
        <div>Client ID</div>
        <div>Customer Name</div>
        <div>Original Order</div>
        <div>Return Reason</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Last Update</div>
      </div>

      {/* Returns Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {getPaginatedReturns().map((returnItem) => (
          <div key={returnItem.id} className="grid grid-cols-10 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center">{returnItem.id}</div>
            <div className="flex items-center">{returnItem.returnNumber}</div>
            <div className="flex items-center">{returnItem.clientId}</div>
            <div className="flex items-center">{returnItem.customerName}</div>
            <div className="flex items-center">{returnItem.originalOrder}</div>
            <div className="flex items-center">{returnItem.returnReason}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                returnItem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                returnItem.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                returnItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {returnItem.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                returnItem.priority === 'High' ? 'bg-red-100 text-red-800' :
                returnItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {returnItem.priority}
              </span>
            </div>
            <div className="flex items-center text-xs">
              {formatDateWithDay(returnItem.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      {/* Approve Returns Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Approve selected returns")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Approve Returns
        </button>
      </div>
    </div>
  )
}

export default ManageReturns 