import { useState } from 'react'
import { ArrowLeft, Download, ChevronDown, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const InventorySnap = () => {
  const navigate = useNavigate()
  
  // State for dropdown visibility
  const [inventoryPipelineOpen, setInventoryPipelineOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  // State for filter data
  const [filterData, setFilterData] = useState({
    warehouses: '',
    brands: '',
    dates: ''
  })

  // State for records per page
  const [recordsPerPage, setRecordsPerPage] = useState(25)

  // State for current page
  const [currentPage, setCurrentPage] = useState(1)

  // State for notification
  const [showNotification, setShowNotification] = useState(false)

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

  const handleFilterChange = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const handlePageChange = (value) => {
    setCurrentPage(parseInt(value))
  }

  const handleShowResults = () => {
    console.log('Show Results clicked for Inventory Snap')
    console.log('Filter data:', filterData)

    // Mock functionality - simulate no records found
    const hasNoRecords = true // Mock: always show no records for demo

    if (hasNoRecords) {
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 4000)
    }
  }

  const handleClearSearch = () => {
    setFilterData({
      warehouses: '',
      brands: '',
      dates: ''
    })
    setCurrentPage(1)
    setRecordsPerPage(25)
  }

  const handleExport = () => {
    alert('Export functionality for Inventory Snap would generate a CSV file.')
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Snap</h1>
              <p className="text-sm text-gray-600">View and manage inventory snapshots</p>
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

          {/* Right side - Export File button and Records Per Page dropdown and Page Number dropdown */}
          <div className="flex flex-col items-end space-y-3">
            {/* Export File Button */}
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export File
            </button>

            {/* Records Per Page dropdown and Page Number dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="recordsPerPageTop" className="text-sm font-medium text-gray-700">Records Per Page:</label>
              <select
                id="recordsPerPageTop"
                value={recordsPerPage}
                onChange={(e) => handleRecordsPerPageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
              </select>
              
              <label htmlFor="pageNumberTop" className="text-sm font-medium text-gray-700 ml-4">Page:</label>
              <select
                id="pageNumberTop"
                value={currentPage}
                onChange={(e) => handlePageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Snap</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Warehouses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouses</label>
              <input
                type="text"
                value={filterData.warehouses}
                onChange={(e) => handleFilterChange('warehouses', e.target.value)}
                placeholder="Enter warehouses"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Brands */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brands</label>
              <input
                type="text"
                value={filterData.brands}
                onChange={(e) => handleFilterChange('brands', e.target.value)}
                placeholder="Enter brands"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dates</label>
              <div className="relative">
                <input
                  type="date"
                  value={filterData.dates}
                  onChange={(e) => handleFilterChange('dates', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Export Inventory Snap Button */}
            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Inventory Snap
              </button>
            </div>
          </div>
        </div>

        {/* Show Results and Clear Search Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            type="button"
            onClick={handleShowResults}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Show Results
          </button>
          <button
            type="button"
            onClick={handleClearSearch}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
          >
            Clear Search
          </button>
        </div>

        {/* Results Header Row */}
        <div className="mt-6">
          <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-8 text-sm font-medium">
            <div>Date</div>
            <div>SKU</div>
            <div>Description</div>
            <div>Quantity</div>
            <div>From Location</div>
            <div>To Location</div>
            <div>User</div>
            <div>Notes</div>
          </div>
        </div>

        {/* Bottom Records Per Page Dropdown */}
        <div className="mt-4 flex justify-end">
          <div className="flex items-center space-x-2">
            <label htmlFor="recordsPerPageBottom" className="text-sm font-medium text-gray-700">Records Per Page:</label>
            <select
              id="recordsPerPageBottom"
              value={recordsPerPage}
              onChange={(e) => handleRecordsPerPageChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
            </select>
            
            <label htmlFor="pageNumberBottom" className="text-sm font-medium text-gray-700 ml-4">Page:</label>
            <select
              id="pageNumberBottom"
              value={currentPage}
              onChange={(e) => handlePageChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1</option>
            </select>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">Inventory Snap Results</p>
            <p className="text-sm">Filtered results will be displayed here.</p>
          </div>
        </div>

        {/* Notification Popup */}
        {showNotification && (
          <div className="fixed bottom-4 left-4 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-lg z-50 fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">No Record Found</span>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InventorySnap 