import { useState } from 'react'
import { ArrowLeft, ChevronDown, Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock data for work orders
const mockWorkOrders = [
  {
    id: 'WO-001',
    sku: 'SKU-001',
    description: 'Widget A Assembly',
    location: 'A1-B2-C3',
    quantity: 150,
    minQuantity: 50,
    maxQuantity: 200,
    status: 'Pending',
    lastUpdate: '2024-07-28'
  },
  {
    id: 'WO-002',
    sku: 'SKU-002',
    description: 'Widget B Assembly',
    location: 'A2-B3-C4',
    quantity: 75,
    minQuantity: 25,
    maxQuantity: 100,
    status: 'In Process',
    lastUpdate: '2024-07-27'
  },
  {
    id: 'WO-003',
    sku: 'SKU-003',
    description: 'Widget C Assembly',
    location: 'A3-B4-C5',
    quantity: 0,
    minQuantity: 10,
    maxQuantity: 50,
    status: 'On Hold',
    lastUpdate: '2024-07-26'
  },
  {
    id: 'WO-004',
    sku: 'SKU-004',
    description: 'Widget D Assembly',
    location: 'A4-B5-C6',
    quantity: 300,
    minQuantity: 100,
    maxQuantity: 500,
    status: 'Ready',
    lastUpdate: '2024-07-25'
  },
  {
    id: 'WO-005',
    sku: 'SKU-005',
    description: 'Widget E Assembly',
    location: 'A5-B6-C7',
    quantity: 25,
    minQuantity: 30,
    maxQuantity: 75,
    status: 'Inbox',
    lastUpdate: '2024-07-24'
  }
]

const ManageRework = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [workOrdersOpen, setWorkOrdersOpen] = useState(false)
  const [kittingAssemblyOpen, setKittingAssemblyOpen] = useState(false)
  
  // State for pagination and search
  const [activeTab, setActiveTab] = useState('Pending')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Dropdown options
  const workOrdersOptions = [
    { label: 'Manage Orders', path: '/rework/manage-orders' },
    { label: 'Create Work Orders', path: '/rework/create-work-orders' }
  ]

  const kittingAssemblyOptions = [
    { label: 'Manage Kits', path: '/rework/manage-kits' }
  ]

  // Tabs configuration
  const tabs = [
    { id: 'On Hold', label: 'On Hold' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Inbox', label: 'Inbox' },
    { id: 'In Process', label: 'In Process' },
    { id: 'Ready', label: 'Ready' },
    { id: 'ALL Work Orders', label: 'ALL Work Orders' }
  ]

  // Filter work orders based on active tab
  const getFilteredWorkOrders = () => {
    if (activeTab === 'ALL Work Orders') {
      return mockWorkOrders
    }
    return mockWorkOrders.filter(item => item.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL Work Orders') {
      return mockWorkOrders.length
    }
    return mockWorkOrders.filter(item => item.status === tabId).length
  }

  // Pagination functions
  const getPaginatedWorkOrders = () => {
    const filteredItems = getFilteredWorkOrders()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredItems.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredItems = getFilteredWorkOrders()
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
    const foundItem = mockWorkOrders.find(item => {
      // Search by SKU
      if (item.sku.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Description
      if (item.description.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Location
      if (item.location.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundItem) {
      console.log('Found item:', foundItem)
      // Navigate to item detail or highlight in table
    } else {
      alert('No work order found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'SKU', 'Description', 'Location', 'Quantity', 'Min Quantity', 'Max Quantity', 'Status', 'Last Update']
    const data = getFilteredWorkOrders().map(item => [
      item.id,
      item.sku,
      item.description,
      item.location,
      item.quantity,
      item.minQuantity,
      item.maxQuantity,
      item.status,
      item.lastUpdate
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `work_orders_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="p-6">
      {/* Dropdowns Container */}
      <div className="mb-4 flex space-x-4">
        {/* Work Orders Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWorkOrdersOpen(!workOrdersOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Work Orders</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${workOrdersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {workOrdersOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {workOrdersOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setWorkOrdersOpen(false)
                      if (option.label === 'Manage Orders') {
                        setActiveTab('Pending')
                      } else {
                        navigate(option.path)
                      }
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

        {/* Kitting & Assembly Dropdown */}
        <div className="relative">
          <button
            onClick={() => setKittingAssemblyOpen(!kittingAssemblyOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Kitting & Assembly</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${kittingAssemblyOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {kittingAssemblyOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {kittingAssemblyOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setKittingAssemblyOpen(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Work Orders</h1>
              <p className="text-sm text-gray-600">View and manage all work orders</p>
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
          
          {/* Right side - Work orders counter and buttons */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Showing {getPaginatedWorkOrders().length} of {getFilteredWorkOrders().length} work orders
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
                placeholder="Search by SKU, Description, or Location"
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
          <div>ID</div>
          <div>SKU</div>
          <div>Description</div>
          <div>Location</div>
          <div>Quantity</div>
          <div>Min Qty</div>
          <div>Max Qty</div>
          <div>Status</div>
          <div>Last Update</div>
        </div>

        {/* Work Orders Rows */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {getPaginatedWorkOrders().map((item) => (
            <div key={item.id} className="grid grid-cols-10 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
              <div className="flex items-center pl-2">
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center">{item.id}</div>
              <div className="flex items-center">{item.sku}</div>
              <div className="flex items-center">{item.description}</div>
              <div className="flex items-center">{item.location}</div>
              <div className="flex items-center">{item.quantity}</div>
              <div className="flex items-center">{item.minQuantity}</div>
              <div className="flex items-center">{item.maxQuantity}</div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Ready' ? 'bg-green-100 text-green-800' :
                  item.status === 'In Process' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                  item.status === 'Inbox' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center text-xs">
                {item.lastUpdate}
              </div>
            </div>
          ))}
        </div>

        {/* Approve Work Orders Button */}
        <div className="mt-3">
          <button
            onClick={() => console.log("Approve selected work orders")}
            className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Approve Work Orders
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageRework 