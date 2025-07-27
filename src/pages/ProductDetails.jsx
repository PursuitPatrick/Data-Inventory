import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '../utils/dateUtils'

const ProductDetails = () => {
  const { skuOrId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock product data - TODO: Replace with API call
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

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Find product by SKU or Client ID
      const foundProduct = mockProducts.find(product => 
        product.sku.toLowerCase() === skuOrId.toLowerCase() ||
        product.clientId.toLowerCase() === skuOrId.toLowerCase()
      )
      
      setProduct(foundProduct)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [skuOrId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Product Not Found</h2>
          <p className="text-red-600 mb-4">No product found with SKU or Client ID: {skuOrId}</p>
          <button
            onClick={() => navigate('/inventory/products')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory/products')}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">SKU</label>
                <p className="text-sm text-gray-900">{product.sku}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Client ID</label>
                <p className="text-sm text-gray-900">{product.clientId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{product.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  product.status === 'Active' ? 'bg-green-100 text-green-800' :
                  product.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                  product.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDate(product.lastUpdate)}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Product ID</label>
                <p className="text-sm text-gray-900">{product.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Created Date</label>
                <p className="text-sm text-gray-900">{formatDate(product.lastUpdate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <p className="text-sm text-gray-900">Apparel</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Warehouse Location</label>
                <p className="text-sm text-gray-900">Section A, Shelf 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ORD-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(product.lastUpdate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">50</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ORD-002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(product.lastUpdate)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Child SKUs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Linked Child SKUs</h2>
        <div className="text-sm text-gray-600">
          <p>No child SKUs linked to this product.</p>
          <p className="mt-2">Child SKUs will appear here when they are created and linked to this parent SKU.</p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails 