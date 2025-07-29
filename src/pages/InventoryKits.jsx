import { useState } from 'react'
import { ArrowLeft, ChevronDown, Download, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock data for inventory kits
const mockKits = [
  {
    id: 'KIT-001',
    sku: 'KIT-001',
    description: 'Kit A',
    location: 'A1-B2-C3',
    quantity: 30,
    minQuantity: 5,
    maxQuantity: 75,
    status: 'Active',
    lastUpdate: '2024-07-28'
  },
  {
    id: 'KIT-002',
    sku: 'KIT-002',
    description: 'Kit B',
    location: 'A2-B3-C4',
    quantity: 15,
    minQuantity: 3,
    maxQuantity: 40,
    status: 'Low Stock',
    lastUpdate: '2024-07-27'
  },
  {
    id: 'KIT-003',
    sku: 'KIT-003',
    description: 'Kit C',
    location: 'A3-B4-C5',
    quantity: 0,
    minQuantity: 1,
    maxQuantity: 20,
    status: 'Out of Stock',
    lastUpdate: '2024-07-26'
  },
  {
    id: 'KIT-004',
    sku: 'KIT-004',
    description: 'Kit D',
    location: 'A4-B5-C6',
    quantity: 60,
    minQuantity: 10,
    maxQuantity: 100,
    status: 'Active',
    lastUpdate: '2024-07-25'
  },
  {
    id: 'KIT-005',
    sku: 'KIT-005',
    description: 'Kit E',
    location: 'A5-B6-C7',
    quantity: 8,
    minQuantity: 2,
    maxQuantity: 25,
    status: 'Low Stock',
    lastUpdate: '2024-07-24'
  },
  {
    id: 'KIT-006',
    sku: 'KIT-006',
    description: 'Kit F',
    location: 'A6-B7-C8',
    quantity: 45,
    minQuantity: 8,
    maxQuantity: 80,
    status: 'Active',
    lastUpdate: '2024-07-23'
  }
]

const InventoryKits = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [inventoryPipelineOpen, setInventoryPipelineOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  // State for pagination and search
  const [activeTab, setActiveTab] = useState('Active')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [kitFilter, setKitFilter] = useState(false)

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

  // Tabs configuration
  const tabs = [
    { id: 'Active', label: 'Active' },
    { id: 'Low Stock', label: 'Low Stock' },
    { id: 'Out of Stock', label: 'Out of Stock' },
    { id: 'ALL Kits', label: 'ALL Kits' }
  ]

  // Filter inventory based on active tab and kit filter
  const getFilteredInventory = () => {
    let filtered = mockKits
    
    // Apply kit filter if active
    if (kitFilter) {
      filtered = filtered.filter(item => item.sku.startsWith('KIT-'))
    }
    
    // Apply status filter
    if (activeTab === 'ALL Kits') {
      return filtered
    }
    return filtered.filter(item => item.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL Kits') {
      return mockKits.length
    }
    return mockKits.filter(item => item.status === tabId).length
  }

  // Pagination functions
  const getPaginatedInventory = () => {
    const filteredInventory = getFilteredInventory()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredInventory.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredInventory = getFilteredInventory()
    return Math.ceil(filteredInventory.length / recordsPerPage)
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
    const foundKit = mockKits.find(kit => {
      // Search by SKU
      if (kit.sku.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Description
      if (kit.description.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Location
      if (kit.location.toLowerCase().includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundKit) {
      console.log('Found kit:', foundKit)
    } else {
      alert('No kit found matching your search criteria.')
    }
  }

  const exportToCSV = () => {
    const headers = ['Kit ID', 'SKU', 'Description', 'Location', 'Quantity', 'Min Quantity', 'Max Quantity', 'Status', 'Last Update']
    const data = getFilteredInventory().map(kit => [
      kit.id,
      kit.sku,
      kit.description,
      kit.location,
      kit.quantity,
      kit.minQuantity,
      kit.maxQuantity,
      kit.status,
      kit.lastUpdate
    ])

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `inventory_kits_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
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
      
      {/* Page Content */}
      <div className="mt-2">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            {/* Left side - Title */}
            <div className="flex flex-col">
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inventory Kits</h1>
                <p className="text-sm text-gray-600">View and manage inventory kits</p>
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
            
            {/* Right side - Inventory counter and buttons */}
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Showing {getPaginatedInventory().length} of {getFilteredInventory().length} inventory kits
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
                  onClick={() => navigate('/inventory/create')}
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

          {/* Kit SKUs Button */}
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
              <button
                onClick={() => setKitFilter(!kitFilter)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  kitFilter 
                    ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:bg-gray-50'
                }`}
              >
                Kit SKUs ({mockKits.length})
              </button>
            </div>
          </div>

          {/* Column Headers */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white text-sm font-medium">
                  <th className="px-4 py-2 text-left">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="px-4 py-2 text-left">DC</th>
                  <th className="px-4 py-2 text-left">Client ID</th>
                  <th className="px-4 py-2 text-left">SKU</th>
                  <th className="px-4 py-2 text-left">BO</th>
                  <th className="px-4 py-2 text-left">EXP</th>
                  <th className="px-4 py-2 text-left">DMG</th>
                  <th className="px-4 py-2 text-left">XFR</th>
                  <th className="px-4 py-2 text-left">In Stock</th>
                  <th className="px-4 py-2 text-left">Committed</th>
                  <th className="px-4 py-2 text-left">Available</th>
                  <th className="px-4 py-2 text-left">Last Update</th>
                  <th className="px-4 py-2 text-left">Last CC</th>
                  <th className="px-4 py-2 text-left">Age</th>
                </tr>
              </thead>
              <tbody className="bg-white rounded-lg shadow-sm border border-gray-200">
                {getPaginatedInventory().map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* DC */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* Client ID */}
                    <td className="px-4 py-3 text-sm text-gray-800">{item.sku}</td> {/* SKU */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* BO */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* EXP */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* DMG */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* XFR */}
                    <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td> {/* In Stock */}
                    <td className="px-4 py-3 text-sm text-gray-800">-</td> {/* Committed */}
                    <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td> {/* Available */}
                    <td className="px-4 py-3 text-xs text-gray-800">{item.lastUpdate}</td> {/* Last Update */}
                    <td className="px-4 py-3 text-xs text-gray-800">-</td> {/* Last CC */}
                    <td className="px-4 py-3 text-xs text-gray-800">-</td> {/* Age */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Process Selected Items Button */}
          <div className="mt-3">
            <button
              onClick={() => console.log("Process selected inventory kits")}
              className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
            >
              Process Selected Items
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryKits 