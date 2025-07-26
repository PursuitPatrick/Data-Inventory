import { useState } from 'react'
import { Package, Truck, Ship, TrendingUp, Clock, User, FileText } from 'lucide-react'
import StatCard from '../components/StatCard'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mockStats = [
  {
    title: 'Total Inventory',
    value: '12,847',
    change: '+12%',
    changeType: 'increase',
    icon: Package,
    color: 'primary'
  },
  {
    title: 'Incoming Items',
    value: '156',
    change: '+8%',
    changeType: 'increase',
    icon: Truck,
    color: 'success'
  },
  {
    title: 'Outgoing Items',
    value: '89',
    change: '-3%',
    changeType: 'decrease',
    icon: Ship,
    color: 'warning'
  },
  {
    title: 'Items in Transit',
    value: '23',
    change: '+15%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'primary'
  }
]

const mockActivity = [
  {
    id: 1,
    type: 'received',
    message: 'Received 50 units of Steel Pipes from ABC Suppliers',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    icon: Truck
  },
  {
    id: 2,
    type: 'shipped',
    message: 'Shipped 25 units of Circuit Boards to TechCorp',
    user: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    icon: Ship
  },
  {
    id: 3,
    type: 'updated',
    message: 'Updated inventory levels for Warehouse Zone A',
    user: 'Mike Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: Package
  },
  {
    id: 4,
    type: 'received',
    message: 'Received 100 units of LED Panels from XYZ Electronics',
    user: 'Lisa Chen',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    icon: Truck
  },
  {
    id: 5,
    type: 'shipped',
    message: 'Shipped 75 units of Sensors to AutoParts Inc',
    user: 'David Brown',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    icon: Ship
  }
]

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const getActivityIcon = (type) => {
    switch (type) {
      case 'received':
        return <Truck className="w-4 h-4 text-success-600" />
      case 'shipped':
        return <Ship className="w-4 h-4 text-primary-600" />
      case 'updated':
        return <Package className="w-4 h-4 text-warning-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'received':
        return 'bg-success-50 border-success-200'
      case 'shipped':
        return 'bg-primary-50 border-primary-200'
      case 'updated':
        return 'bg-warning-50 border-warning-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field w-auto"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Inventory Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last 30 days</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart placeholder</p>
              <p className="text-sm text-gray-400">AI-powered analytics coming soon</p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {format(activity.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Truck className="w-6 h-6 text-success-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Receive Items</p>
              <p className="text-sm text-gray-500">Record new shipments</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Ship className="w-6 h-6 text-primary-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Ship Items</p>
              <p className="text-sm text-gray-500">Process outgoing orders</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Package className="w-6 h-6 text-warning-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Update Inventory</p>
              <p className="text-sm text-gray-500">Modify stock levels</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 