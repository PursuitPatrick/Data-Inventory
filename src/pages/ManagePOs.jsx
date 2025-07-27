import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Plus } from 'lucide-react'
import { formatDateWithDay } from '../utils/dateUtils'

// Mock data for purchase orders
const mockPOs = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-001',
    supplier: 'ABC Suppliers',
    totalItems: 75,
    receivedItems: 75,
    expectedDate: '2024-07-30',
    receivedDate: '2024-07-28',
    status: 'Received',
    receiver: 'John Smith',
    lastUpdate: '2024-07-28'
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-002',
    supplier: 'TechCorp',
    totalItems: 150,
    receivedItems: 0,
    expectedDate: '2024-08-02',
    receivedDate: null,
    status: 'Expected',
    receiver: null,
    lastUpdate: '2024-07-25'
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2024-003',
    supplier: 'XYZ Electronics',
    totalItems: 75,
    receivedItems: 75,
    expectedDate: '2024-07-29',
    receivedDate: '2024-07-27',
    status: 'Received',
    receiver: 'Sarah Johnson',
    lastUpdate: '2024-07-27'
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2024-004',
    supplier: 'MetalCorp',
    totalItems: 30,
    receivedItems: 0,
    expectedDate: '2024-07-26',
    receivedDate: null,
    status: 'On Hold',
    receiver: null,
    lastUpdate: '2024-07-24'
  },
  {
    id: 'PO-005',
    poNumber: 'PO-2024-005',
    supplier: 'Global Parts',
    totalItems: 200,
    receivedItems: 0,
    expectedDate: '2024-08-05',
    receivedDate: null,
    status: 'Expected',
    receiver: null,
    lastUpdate: '2024-07-26'
  },
  {
    id: 'PO-006',
    poNumber: 'PO-2024-006',
    supplier: 'Fast Logistics',
    totalItems: 120,
    receivedItems: 0,
    expectedDate: '2024-08-10',
    receivedDate: null,
    status: 'Expected',
    receiver: null,
    lastUpdate: '2024-07-27'
  },
  {
    id: 'PO-007',
    poNumber: 'PO-2024-007',
    supplier: 'Quality Parts',
    totalItems: 85,
    receivedItems: 85,
    expectedDate: '2024-07-25',
    receivedDate: '2024-07-23',
    status: 'Received',
    receiver: 'Mike Wilson',
    lastUpdate: '2024-07-23'
  },
  {
    id: 'PO-008',
    poNumber: 'PO-2024-008',
    supplier: 'Reliable Supply',
    totalItems: 95,
    receivedItems: 0,
    expectedDate: '2024-07-28',
    receivedDate: null,
    status: 'Arrived',
    receiver: null,
    lastUpdate: '2024-07-22'
  },
  {
    id: 'PO-009',
    poNumber: 'PO-2024-009',
    supplier: 'Premium Goods',
    totalItems: 180,
    receivedItems: 0,
    expectedDate: '2024-08-08',
    receivedDate: null,
    status: 'In Process',
    receiver: null,
    lastUpdate: '2024-07-28'
  },
  {
    id: 'PO-010',
    poNumber: 'PO-2024-010',
    supplier: 'Express Delivery',
    totalItems: 60,
    receivedItems: 60,
    expectedDate: '2024-07-24',
    receivedDate: '2024-07-22',
    status: 'Received',
    receiver: 'Lisa Brown',
    lastUpdate: '2024-07-22'
  },
  {
    id: 'PO-011',
    poNumber: 'PO-2024-011',
    supplier: 'Rework Solutions',
    totalItems: 45,
    receivedItems: 0,
    expectedDate: '2024-08-15',
    receivedDate: null,
    status: 'Rework',
    receiver: null,
    lastUpdate: '2024-07-29'
  },
  {
    id: 'PO-012',
    poNumber: 'PO-2024-012',
    supplier: 'Quality Control Inc',
    totalItems: 90,
    receivedItems: 0,
    expectedDate: '2024-08-12',
    receivedDate: null,
    status: 'Rework',
    receiver: null,
    lastUpdate: '2024-07-30'
  },
  {
    id: 'PO-013',
    poNumber: 'PO-2024-013',
    supplier: 'On Hold Supplies',
    totalItems: 55,
    receivedItems: 0,
    expectedDate: '2024-08-20',
    receivedDate: null,
    status: 'On Hold',
    receiver: null,
    lastUpdate: '2024-07-31'
  }
]

const ManagePOs = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Expected')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { id: 'On Hold', label: 'On Hold' },
    { id: 'Expected', label: 'Expected' },
    { id: 'Arrived', label: 'Arrived' },
    { id: 'Rework', label: 'Rework' },
    { id: 'In Process', label: 'In Process' },
    { id: 'Received', label: 'Received' }
  ]

  const getFilteredPOs = () => {
    return mockPOs.filter(po => po.status === activeTab)
  }

  const getPaginatedPOs = () => {
    const filtered = getFilteredPOs()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredPOs().length / recordsPerPage)
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(parseInt(value))
    setCurrentPage(1) // Reset to first page when changing records per page
  }

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value))
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      console.log('Search term is empty')
      return
    }

    const searchValue = searchTerm.trim().toLowerCase()
    
    // Search in the current dataset
    const foundPO = mockPOs.find(po => {
      // Search by PO Number
      if (po.poNumber.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Supplier
      if (po.supplier.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Date (formatted as MM/DD/YYYY)
      const formattedDate = formatDateWithDay(po.lastUpdate)
      if (formattedDate.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundPO) {
      navigate(`/pos/details/${foundPO.poNumber}`) // Placeholder route
    } else {
      alert('No PO found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const filteredPOs = getFilteredPOs()
    const headers = ['PO Number', 'Supplier', 'Total Items', 'Received Items', 'Expected Date', 'Status', 'Receiver', 'Last Update']
    const csvContent = [
      headers.join(','),
      ...filteredPOs.map(po => [
        po.poNumber,
        po.supplier,
        po.totalItems,
        po.receivedItems,
        formatDateWithDay(po.expectedDate),
        po.status,
        po.receiver || '',
        formatDateWithDay(po.lastUpdate)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pos_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTabCount = (tabId) => {
    return mockPOs.filter(po => po.status === tabId).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left side - Title */}
        <div className="flex flex-col">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage POs</h1>
            <p className="text-sm text-gray-600">View and manage all purchase orders</p>
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
        
        {/* Right side - PO counter and buttons */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Showing {getPaginatedPOs().length} of {getFilteredPOs().length} purchase orders
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
              onClick={() => navigate('/receiving/create-po')}
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
              placeholder="Search by PO Number, Supplier, or Date"
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
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1) // Reset to first page when switching tabs
              }}
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
      <div className="bg-black text-white px-4 py-2 grid grid-cols-11 text-sm font-medium">
        <div className="flex items-center pl-2">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div>Sys #</div>
        <div>PO</div>
        <div>DC</div>
        <div>Client ID</div>
        <div>Lines</div>
        <div>Total Qty</div>
        <div>Date Expected</div>
        <div>Last Update</div>
        <div>Status</div>
        <div>Action</div>
      </div>

      {/* PO Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {getPaginatedPOs().map((po) => (
          <div key={po.id} className="grid grid-cols-11 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center">{po.id}</div>
            <div className="flex items-center">{po.poNumber}</div>
            <div className="flex items-center">-</div>
            <div className="flex items-center">-</div>
            <div className="flex items-center">-</div>
            <div className="flex items-center">{po.totalItems}</div>
            <div className="flex items-center text-xs">
              {formatDateWithDay(po.expectedDate)}
            </div>
            <div className="flex items-center text-xs">
              {formatDateWithDay(po.lastUpdate)}
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                po.status === 'Received' ? 'bg-green-100 text-green-800' :
                po.status === 'Expected' ? 'bg-blue-100 text-blue-800' :
                po.status === 'Arrived' ? 'bg-purple-100 text-purple-800' :
                po.status === 'Rework' ? 'bg-orange-100 text-orange-800' :
                po.status === 'In Process' ? 'bg-yellow-100 text-yellow-800' :
                po.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {po.status}
              </span>
            </div>
            <div className="flex items-center">
              <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Process Selected POs Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Process selected POs")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Process Selected POs
        </button>
      </div>
    </div>
  )
}

export default ManagePOs 