import { useState } from 'react'
import { Download, Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/dateUtils'

const ManageProducts = () => {
  const [activeTab, setActiveTab] = useState('Active')
  const [recordsPerPage, setRecordsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('') // Added search state
  const navigate = useNavigate()

  const tabs = [
    { id: 'On Hold', label: 'On Hold' },
    { id: 'Active', label: 'Active' },
    { id: 'Inactive', label: 'Inactive' },
    { id: 'Discontinued', label: 'Discontinued' },
    { id: 'ALL SKUs', label: 'ALL SKUs' }
  ]

  // Mock product data - TODO: Replace with API data based on selected tab
  const mockProducts = [
    { id: 1, sku: 'SKU001', clientId: 'ClientA', description: 'Blue Jacket Size L', lastUpdate: '2025-01-26T00:00:00Z', status: 'Active' },
    { id: 2, sku: 'SKU002', clientId: 'ClientB', description: 'Red T-Shirt Size M', lastUpdate: '2025-01-25T00:00:00Z', status: 'Active' },
    { id: 3, sku: 'SKU003', clientId: 'ClientC', description: 'Black Jeans Size 32', lastUpdate: '2025-01-24T00:00:00Z', status: 'On Hold' },
    { id: 4, sku: 'SKU004', clientId: 'ClientA', description: 'White Sneakers Size 10', lastUpdate: '2025-01-23T00:00:00Z', status: 'Inactive' },
    { id: 5, sku: 'SKU005', clientId: 'ClientD', description: 'Green Hoodie Size XL', lastUpdate: '2025-01-22T00:00:00Z', status: 'Active' },
    { id: 6, sku: 'SKU006', clientId: 'ClientE', description: 'Leather Wallet Brown', lastUpdate: '2025-01-21T00:00:00Z', status: 'On Hold' },
    { id: 7, sku: 'SKU007', clientId: 'ClientF', description: 'Silver Watch Classic', lastUpdate: '2025-01-20T00:00:00Z', status: 'Discontinued' },
    { id: 8, sku: 'SKU008', clientId: 'ClientG', description: 'Cotton Socks Pack', lastUpdate: '2025-01-19T00:00:00Z', status: 'Inactive' },
    { id: 9, sku: 'SKU009', clientId: 'ClientH', description: 'Denim Jacket Blue', lastUpdate: '2025-01-18T00:00:00Z', status: 'Active' },
    { id: 10, sku: 'SKU010', clientId: 'ClientI', description: 'Running Shoes Black', lastUpdate: '2025-01-17T00:00:00Z', status: 'Discontinued' }
  ]

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === 'ALL SKUs') {
      return mockProducts
    }
    return mockProducts.filter(product => product.status === activeTab)
  }

  // Get count for each tab
  const getTabCount = (tabId) => {
    if (tabId === 'ALL SKUs') {
      return mockProducts.length
    }
    return mockProducts.filter(product => product.status === tabId).length
  }

  // Pagination functions
  const getPaginatedProducts = () => {
    const filteredProducts = getFilteredProducts()
    const startIndex = (currentPage - 1) * recordsPerPage
    const endIndex = startIndex + recordsPerPage
    return filteredProducts.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filteredProducts = getFilteredProducts()
    return Math.ceil(filteredProducts.length / recordsPerPage)
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
    const foundProduct = mockProducts.find(product => {
      // Search by SKU
      if (product.sku.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Client ID
      if (product.clientId.toLowerCase().includes(searchValue)) {
        return true
      }
      // Search by Order Date (formatted as MM/DD/YYYY)
      const formattedDate = formatDate(product.lastUpdate)
      if (formattedDate.includes(searchValue)) {
        return true
      }
      return false
    })

    if (foundProduct) {
      console.log('Product found:', foundProduct)
      // Navigate to product details page
      navigate(`/products/details/${foundProduct.sku}`)
    } else {
      console.log('No product found for search term:', searchValue)
      // TODO: Show "No results found" message
      alert('No results found for your search term.')
    }
  }

  // Export products to CSV
  const exportToCSV = () => {
    const filteredProducts = getFilteredProducts()
    
    // Create CSV headers
    const headers = ['SKU', 'Client ID', 'Description', 'Last Update', 'Status']
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.sku,
        product.clientId,
        `"${product.description}"`, // Wrap description in quotes to handle commas
        formatDate(product.lastUpdate),
        product.status
      ].join(','))
    ].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    // Generate filename with current date
    const today = new Date()
    const dateString = today.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-')
    
    const filename = `products_export_${dateString}.csv`
    
    // Set up download
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getTabContent = (tabId) => {
    switch (tabId) {
      case 'On Hold':
        return 'You are viewing: On Hold Products'
      case 'Active':
        return 'You are viewing: Active Products'
      case 'Inactive':
        return 'You are viewing: Inactive Products'
      case 'Discontinued':
        return 'You are viewing: Discontinued Products'
      case 'ALL SKUs':
        return 'You are viewing: ALL SKUs'
      default:
        return 'Select a tab to view products'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left side - Title */}
        <div className="flex flex-col">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            <p className="text-sm text-gray-600">View and manage your product inventory</p>
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
        
        {/* Right side - Product counter and buttons */}
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Showing {getPaginatedProducts().length} of {getFilteredProducts().length} products
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
              onClick={() => navigate('/create-products')}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dropdowns */}
      <div className="flex justify-end space-x-4 mt-4">
        {/* Records Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Records Per Page
          </label>
          <select
            value={recordsPerPage}
            onChange={(e) => handleRecordsPerPageChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>

        {/* Page Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page
          </label>
          <select
            value={currentPage}
            onChange={(e) => handlePageChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="flex justify-end mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
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
            placeholder="Search by SKU, Client ID, or Order Date"
            className="text-sm px-3 py-2 border border-gray-300 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
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
      <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-6 text-sm font-medium">
        <div className="flex items-center pl-2">
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div>SKU</div>
        <div>Client ID</div>
        <div>Description</div>
        <div>Last Update</div>
        <div>Status</div>
      </div>

      {/* Product Rows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {getPaginatedProducts().map((product) => (
          <div key={product.id} className="grid grid-cols-6 border-b border-gray-200 py-3 px-4 text-sm text-gray-800 hover:bg-gray-50">
            <div className="flex items-center pl-2">
              <input type="checkbox" className="w-4 h-4" />
            </div>
            <div className="flex items-center">{product.sku}</div>
            <div className="flex items-center">{product.clientId}</div>
            <div className="flex items-center">{product.description}</div>
            <div className="flex items-center">{formatDate(product.lastUpdate)}</div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.status === 'Active' ? 'bg-green-100 text-green-800' :
                product.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                product.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mark as Discontinued Button */}
      <div className="mt-3">
        <button
          onClick={() => console.log("Mark selected SKUs as discontinued")}
          className="bg-black text-white text-xs px-3 py-1.5 rounded hover:bg-gray-800 transition-colors duration-200"
        >
          Mark as Discontinued
        </button>
      </div>
    </div>
  )
}

export default ManageProducts 