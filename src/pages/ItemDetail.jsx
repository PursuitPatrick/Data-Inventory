import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, Clock, TrendingUp, TrendingDown, Edit, History, Truck, Ship } from 'lucide-react'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mockItemDetails = {
  'INV-001': {
    id: 'INV-001',
    name: 'Steel Pipes',
    sku: 'STL-PIPE-001',
    category: 'Raw Materials',
    supplier: 'ABC Suppliers',
    description: 'High-quality steel pipes for industrial applications. Available in various diameters and lengths.',
    currentQuantity: 1250,
    minQuantity: 100,
    maxQuantity: 2000,
    location: 'Zone A / Shelf 3',
    status: 'in-stock',
    unitPrice: 45.99,
    totalValue: 57487.50,
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    createdDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    lifetimeReceived: 1500,
    lifetimeShipped: 250,
    locationHistory: [
      { from: 'Dock', to: 'Zone A / Shelf 3', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), user: 'John Smith' },
      { from: 'Zone B / Shelf 1', to: 'Zone A / Shelf 3', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), user: 'Sarah Johnson' }
    ],
    activityHistory: [
      {
        id: 1,
        type: 'received',
        quantity: 50,
        date: new Date(Date.now() - 1000 * 60 * 60 * 2),
        user: 'John Smith',
        reference: 'PO-2024-001',
        notes: 'Received from ABC Suppliers'
      },
      {
        id: 2,
        type: 'shipped',
        quantity: 25,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24),
        user: 'Sarah Johnson',
        reference: 'ORD-2024-001',
        notes: 'Shipped to TechCorp'
      },
      {
        id: 3,
        type: 'received',
        quantity: 100,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        user: 'Mike Wilson',
        reference: 'PO-2024-003',
        notes: 'Bulk order received'
      },
      {
        id: 4,
        type: 'adjusted',
        quantity: -5,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        user: 'Lisa Chen',
        reference: 'ADJ-001',
        notes: 'Damage adjustment'
      }
    ]
  }
}

const ItemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Simulate API call
    const fetchItem = async () => {
      // TODO: Replace with actual API call
      const itemData = mockItemDetails[id]
      if (itemData) {
        setItem(itemData)
      } else {
        // Handle item not found
        console.error('Item not found:', id)
      }
    }
    
    fetchItem()
  }, [id])

  if (!item) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading item details...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'bg-success-50 text-success-700 border-success-200'
      case 'low':
        return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'reorder':
        return 'bg-danger-50 text-danger-700 border-danger-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock'
      case 'low':
        return 'Low Stock'
      case 'reorder':
        return 'Reorder'
      default:
        return status
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'received':
        return <Truck className="w-4 h-4 text-success-600" />
      case 'shipped':
        return <Ship className="w-4 h-4 text-primary-600" />
      case 'adjusted':
        return <Edit className="w-4 h-4 text-warning-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'received':
        return 'bg-success-50 border-success-200'
      case 'shipped':
        return 'bg-primary-50 border-primary-200'
      case 'adjusted':
        return 'bg-warning-50 border-warning-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/inventory')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
            <p className="text-gray-600">Item ID: {item.id} • SKU: {item.sku}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Item
          </button>
          <button className="btn-primary flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Update Stock
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
          {getStatusLabel(item.status)}
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {format(item.lastUpdated, 'MMM d, yyyy h:mm a')}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Package },
            { id: 'history', label: 'History', icon: History },
            { id: 'location', label: 'Location', icon: MapPin }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{item.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <p className="mt-1 text-sm text-gray-900">{item.supplier}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                  <p className="mt-1 text-sm text-gray-900">${item.unitPrice}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Value</label>
                  <p className="mt-1 text-sm text-gray-900">${item.totalValue.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Stock Levels */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Levels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{item.currentQuantity}</div>
                  <div className="text-sm text-gray-500">Current Stock</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600">{item.minQuantity}</div>
                  <div className="text-sm text-gray-500">Minimum Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{item.maxQuantity}</div>
                  <div className="text-sm text-gray-500">Maximum Level</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Stock Level</span>
                  <span>{Math.round((item.currentQuantity / item.maxQuantity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(item.currentQuantity / item.maxQuantity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lifetime Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-success-600 mr-2" />
                    <span className="text-sm text-gray-600">Total Received</span>
                  </div>
                  <span className="font-medium">{item.lifetimeReceived}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingDown className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-sm text-gray-600">Total Shipped</span>
                  </div>
                  <span className="font-medium">{item.lifetimeShipped}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-600">Net Change</span>
                  </div>
                  <span className="font-medium">{item.lifetimeReceived - item.lifetimeShipped}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{item.location}</span>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Receive Items
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Ship className="w-4 h-4 mr-2" />
                  Ship Items
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Adjust Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity History</h3>
          <div className="space-y-4">
            {item.activityHistory.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'received' ? 'Received' : 
                         activity.type === 'shipped' ? 'Shipped' : 'Adjusted'} {Math.abs(activity.quantity)} units
                      </p>
                      <span className="text-xs text-gray-500">
                        {format(activity.date, 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Reference:</span> {activity.reference} • 
                      <span className="font-medium ml-2">User:</span> {activity.user}
                    </div>
                    {activity.notes && (
                      <p className="mt-1 text-sm text-gray-600">{activity.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'location' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location History</h3>
          <div className="space-y-4">
            {item.locationHistory.map((location, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{location.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-900">{location.to}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {format(location.date, 'MMM d, yyyy')} • {location.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetail 