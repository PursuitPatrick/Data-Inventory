import { useState } from 'react'
import { Download, Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateWithDay } from '../utils/dateUtils'

// Mock data for rework items
const mockReworkItems = [
  {
    id: 'RW-001',
    sku: 'SKU001',
    clientId: 'ClientA',
    description: 'Blue Jacket Size L - Quality Issue',
    lastUpdate: '2025-01-26T00:00:00Z',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'John Smith'
  },
  {
    id: 'RW-002',
    sku: 'SKU002',
    clientId: 'ClientB',
    description: 'Red T-Shirt Size M - Stitching Problem',
    lastUpdate: '2025-01-25T00:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 'RW-003',
    sku: 'SKU003',
    clientId: 'ClientC',
    description: 'Black Jeans Size 32 - Zipper Issue',
    lastUpdate: '2025-01-24T00:00:00Z',
    status: 'Completed',
    priority: 'Low',
    assignedTo: 'Mike Wilson'
  },
  {
    id: 'RW-004',
    sku: 'SKU004',
    clientId: 'ClientA',
    description: 'White Sneakers Size 10 - Sole Separation',
    lastUpdate: '2025-01-23T00:00:00Z',
    status: 'In Progress',
    priority: 'High',
    assignedTo: 'John Smith'
  },
  {
    id: 'RW-005',
    sku: 'SKU005',
    clientId: 'ClientD',
    description: 'Green Hoodie Size XL - Color Fading',
    lastUpdate: '2025-01-22T00:00:00Z',
    status: 'Pending',
    priority: 'Medium',
    assignedTo: 'Sarah Johnson'
  }
]

const ManageRework = () => {
  const [activeTab, setActiveTab] = useState('In Progress')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const tabs = [
    { id: 'Pending', label: 'Pending' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' },
    { id: 'ALL Rework', label: 'ALL Rework' }
  ]

  // Filter rework items based on active tab
  const getFilteredReworkItems = () => {
    if (activeTab === 'ALL Rework') {
      return mockReworkItems
    }
    return mockReworkItems.filter(item => item.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL Rework') {
      return mockReworkItems.length
    }
    return mockReworkItems.filter(item => item.status === tabId).length
  }

  // Pagination functions
  const getPaginatedReworkItems = () => {
    const filteredItems = getFilteredReworkItems()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredItems = getFilteredReworkItems()
    return Math.ceil(filteredItems.length / recordsPerPage)
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
    const foundItem = mockReworkItems.find(item => {
      // Search by Rework ID
      if (item.id.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by SKU
      if (item.sku.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Client ID
      if (item.clientId.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Date (formatted as MM/DD/YYYY)
      const formattedDate = formatDateWithDay(item.lastUpdate)
      if (formattedDate.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundItem) {
      navigate(`/rework/details/${foundItem.id}`) // Placeholder route
    } else {
      alert('No rework item found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const headers = ['Rework ID', 'SKU', 'Client ID', 'Description', 'Status', 'Priority', 'Assigned To', 'Last Update']
    const data = getFilteredReworkItems().map(item => [
      item.id,
      item.sku,
      item.clientId,
      item.description,
      item.status,
      item.priority,
      item.assignedTo,
      formatDateWithDay(item.lastUpdate)
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `rework_export_${formatDateWithDay(new Date()).replace(/\//g, '-')}.csv`)
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Rework</h1>
            <p className="text-sm text-gray-600">View and manage all rework items</p>
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
        
        {/* Right side - Rework counter and buttons */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Showing {getPaginatedReworkItems().length} of {getFilteredReworkItems().length} rework items
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
              onClick={() => navigate('/rework/create')}
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
              placeholder="Search by Rework ID, SKU, Client ID, or Date"
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
      <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-8 text-sm font-medium">
        <div className="flex items-center pl-2">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div>Rework ID</div>
        <div>SKU</div>
        <div>Client ID</div>
        <div>Description</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Last Update</div>
      </div>

      {/* Rework Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {getPaginatedReworkItems().map((item) => (
          <div key={item.id} className="grid grid-cols-8 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center">{item.id}</div>
            <div className="flex items-center">{item.sku}</div>
            <div className="flex items-center">{item.clientId}</div>
            <div className="flex items-center">{item.description}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.priority === 'High' ? 'bg-red-100 text-red-800' :
                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {item.priority}
              </span>
            </div>
            <div className="flex items-center text-xs">
              {formatDateWithDay(item.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      {/* Mark as Completed Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Mark selected rework items as completed")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Mark as Completed
        </button>
      </div>
    </div>
  )
}

export default ManageRework 