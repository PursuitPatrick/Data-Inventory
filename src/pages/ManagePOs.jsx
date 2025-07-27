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
    status: 'Pending',
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
    status: 'Overdue',
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
    status: 'Pending',
    receiver: null,
    lastUpdate: '2024-07-26'
  }
]

const ManagePOs = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Expected')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const getFilteredPOs = () => {
    let filtered = mockPOs
    
    // Placeholder filtering logic - in real app, this would filter by actual status
    // For now, just return all POs regardless of tab selection
    if (searchTerm) {
      filtered = filtered.filter(po => 
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDateWithDay(po.lastUpdate).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
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

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handlePageChange = (e) => {
    setCurrentPage(parseInt(e.target.value))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const filtered = getFilteredPOs()
    if (filtered.length === 1) {
      navigate(`/pos/details/${filtered[0].poNumber}`)
    } else if (filtered.length === 0) {
      alert('No matching purchase orders found')
    } else {
      // Multiple results - could show a list or just filter the current view
      console.log('Multiple results found:', filtered.length)
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

  const getTabCount = (status) => {
    // Placeholder counts for now - in real app, this would filter actual data
    const counts = {
      'On Hold': 3,
      'Expected': 5,
      'Arrived': 2,
      'Rework': 1,
      'In Process': 4,
      'Received': 8
    }
    return counts[status] || 0
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Page Title and Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage POs</h1>
        <p className="text-gray-600 mt-1">View and manage all purchase orders</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/receiving/create-po')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </button>
          <button
            onClick={exportToCSV}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col items-end mt-2 space-y-2">
          <div className="flex space-x-2 mt-1">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-0.5 block">Records Per Page</label>
              <select
                value={recordsPerPage}
                onChange={handleRecordsPerPageChange}
                className="border rounded px-2 py-1 text-xs w-28"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-0.5 block">Page</label>
              <select
                value={currentPage}
                onChange={handlePageChange}
                className="border rounded px-2 py-1 text-xs w-28"
              >
                {Array.from({ length: getTotalPages() }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Page {i + 1}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex justify-end">
            <input
              type="text"
              placeholder="Search by PO Number, Supplier, or Date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm px-3 py-2 border rounded w-64"
            />
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {['On Hold', 'Expected', 'Arrived', 'Rework', 'In Process', 'Received'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab} ({getTabCount(tab)})
            </button>
          ))}
        </nav>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-10 gap-4 px-6 py-2 bg-black rounded-t-md">
          <div className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300" />
          </div>
          <div className="text-sm font-bold text-white">Sys #</div>
          <div className="text-sm font-bold text-white">PO</div>
          <div className="text-sm font-bold text-white">DC</div>
          <div className="text-sm font-bold text-white">Client ID</div>
          <div className="text-sm font-bold text-white">Lines</div>
          <div className="text-sm font-bold text-white">Total Qty</div>
          <div className="text-sm font-bold text-white">Date Expected</div>
          <div className="text-sm font-bold text-white">Last Update</div>
          <div className="text-sm font-bold text-white">Status</div>
        </div>

        {/* Data Rows */}
        {getPaginatedPOs().map((po) => (
          <div key={po.id} className="grid grid-cols-10 gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50">
            <div className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" />
            </div>
            <div className="flex items-center text-xs">{po.id}</div>
            <div className="flex items-center text-xs">{po.poNumber}</div>
            <div className="flex items-center text-xs">-</div>
            <div className="flex items-center text-xs">-</div>
            <div className="flex items-center text-xs">-</div>
            <div className="flex items-center text-xs">{po.totalItems}</div>
            <div className="flex items-center text-xs">{formatDateWithDay(po.expectedDate)}</div>
            <div className="flex items-center text-xs">{formatDateWithDay(po.lastUpdate)}</div>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                po.status === 'Received' ? 'bg-green-100 text-green-800' :
                po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {po.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mark as Discontinued Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Mark selected POs as discontinued")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800"
        >
          Mark as Discontinued
        </button>
      </div>
    </div>
  )
}

export default ManagePOs 