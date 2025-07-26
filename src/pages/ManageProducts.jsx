import { useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { formatDate } from '../utils/dateUtils'

const ManageProducts = () => {
  const [activeTab, setActiveTab] = useState('Active')

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600">View and manage your product inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Showing {getFilteredProducts().length} of {mockProducts.length} products
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Create
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
              {tab.label}
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
        {getFilteredProducts().map((product) => (
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
    </div>
  )
}

export default ManageProducts 