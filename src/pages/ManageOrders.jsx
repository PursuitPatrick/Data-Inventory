import { useState } from 'react'
import { Download, Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDateWithDay } from '../utils/dateUtils'

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    orderNumber: 'ORD-2024-001',
    clientId: 'ClientA',
    customerName: 'John Doe',
    totalAmount: 1250.00,
    lastUpdate: '2025-01-26T00:00:00Z',
    status: 'Processing',
    priority: 'High',
    items: 5
  },
  {
    id: 'ORD-002',
    orderNumber: 'ORD-2024-002',
    clientId: 'ClientB',
    customerName: 'Jane Smith',
    totalAmount: 850.50,
    lastUpdate: '2025-01-25T00:00:00Z',
    status: 'Shipped',
    priority: 'Medium',
    items: 3
  },
  {
    id: 'ORD-003',
    orderNumber: 'ORD-2024-003',
    clientId: 'ClientC',
    customerName: 'Bob Johnson',
    totalAmount: 2100.75,
    lastUpdate: '2025-01-24T00:00:00Z',
    status: 'Delivered',
    priority: 'Low',
    items: 8
  },
  {
    id: 'ORD-004',
    orderNumber: 'ORD-2024-004',
    clientId: 'ClientA',
    customerName: 'Alice Brown',
    totalAmount: 675.25,
    lastUpdate: '2025-01-23T00:00:00Z',
    status: 'Pending',
    priority: 'High',
    items: 2
  },
  {
    id: 'ORD-005',
    orderNumber: 'ORD-2024-005',
    clientId: 'ClientD',
    customerName: 'Charlie Wilson',
    totalAmount: 1890.00,
    lastUpdate: '2025-01-22T00:00:00Z',
    status: 'Processing',
    priority: 'Medium',
    items: 6
  }
]

const ManageOrders = () => {
  const [activeTab, setActiveTab] = useState('Processing')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const tabs = [
    { id: 'Pending', label: 'Pending' },
    { id: 'Processing', label: 'Processing' },
    { id: 'Shipped', label: 'Shipped' },
    { id: 'Delivered', label: 'Delivered' },
    { id: 'ALL Orders', label: 'ALL Orders' }
  ]

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (activeTab === 'ALL Orders') {
      return mockOrders
    }
    return mockOrders.filter(order => order.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL Orders') {
      return mockOrders.length
    }
    return mockOrders.filter(order => order.status === tabId).length
  }

  // Pagination functions
  const getPaginatedOrders = () => {
    const filteredOrders = getFilteredOrders()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredOrders.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredOrders = getFilteredOrders()
    return Math.ceil(filteredOrders.length / recordsPerPage)
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
    const foundOrder = mockOrders.find(order => {
      // Search by Order Number
      if (order.orderNumber.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Client ID
      if (order.clientId.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Customer Name
      if (order.customerName.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Date (formatted as MM/DD/YYYY)
      const formattedDate = formatDateWithDay(order.lastUpdate)
      if (formattedDate.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundOrder) {
      navigate(`/orders/details/${foundOrder.id}`) // Placeholder route
    } else {
      alert('No order found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const headers = ['Order ID', 'Order Number', 'Client ID', 'Customer Name', 'Total Amount', 'Status', 'Priority', 'Items', 'Last Update']
    const data = getFilteredOrders().map(order => [
      order.id,
      order.orderNumber,
      order.clientId,
      order.customerName,
      order.totalAmount.toFixed(2),
      order.status,
      order.priority,
      order.items,
      formatDateWithDay(order.lastUpdate)
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `orders_export_${formatDateWithDay(new Date()).replace(/\//g, '-')}.csv`)
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
            <p className="text-sm text-gray-600">View and manage all customer orders</p>
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
        
        {/* Right side - Orders counter and buttons */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Showing {getPaginatedOrders().length} of {getFilteredOrders().length} orders
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
              onClick={() => navigate('/orders/create')}
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
              placeholder="Search by Order Number, Client ID, or Customer Name"
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
      <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-9 text-sm font-medium">
        <div className="flex items-center pl-2">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div>Order ID</div>
        <div>Order Number</div>
        <div>Client ID</div>
        <div>Customer Name</div>
        <div>Total Amount</div>
        <div>Status</div>
        <div>Priority</div>
        <div>Last Update</div>
      </div>

      {/* Orders Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {getPaginatedOrders().map((order) => (
          <div key={order.id} className="grid grid-cols-9 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center">{order.id}</div>
            <div className="flex items-center">{order.orderNumber}</div>
            <div className="flex items-center">{order.clientId}</div>
            <div className="flex items-center">{order.customerName}</div>
            <div className="flex items-center">${order.totalAmount.toFixed(2)}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.priority === 'High' ? 'bg-red-100 text-red-800' :
                order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.priority}
              </span>
            </div>
            <div className="flex items-center text-xs">
              {formatDateWithDay(order.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      {/* Mark as Shipped Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Mark selected orders as shipped")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Mark as Shipped
        </button>
      </div>
    </div>
  )
}

export default ManageOrders 