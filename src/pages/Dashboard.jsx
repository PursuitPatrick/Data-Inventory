import { useState } from 'react'
import { Package, Truck, Ship, TrendingUp, Clock, User, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import TimeZoneDisplay from '../components/TimeZoneDisplay'
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
  const [productsDate, setProductsDate] = useState(new Date().toISOString().split('T')[0])
  const [inboundDate, setInboundDate] = useState(new Date().toISOString().split('T')[0])

  // Mock data for Products chart - TODO: Replace with AI/dynamic data based on selected date
  const productsData = [
    { name: 'On Hold', value: 45 },
    { name: 'Active', value: 128 },
    { name: 'Inactive', value: 23 },
    { name: 'ALL SKU\'s', value: 196 }
  ]

  // Mock data for Inbound chart - TODO: Replace with AI/dynamic data based on selected date
  const inboundData = [
    { name: 'On Hold', value: 12 },
    { name: 'Expected', value: 67 },
    { name: 'Rework', value: 8 },
    { name: 'In Process', value: 34 }
  ]

  // Mock data for Warehouse section - TODO: Replace with AI/live warehouse data
  const warehouseData = [
    { label: 'All Boxes', count: 180, color: 'text-gray-700' },
    { label: 'In Stock', count: 120, color: 'text-green-600' },
    { label: 'Low Stock', count: 40, color: 'text-yellow-600' },
    { label: 'Out Of Stock', count: 20, color: 'text-red-600' }
  ]

  // Mock data for metric boxes - TODO: Replace with AI/dynamic data
  const outboundData = [
    { label: 'On Hold', count: 12, color: 'text-yellow-600' },
    { label: 'Pending', count: 8, color: 'text-orange-600' },
    { label: 'Inbox', count: 25, color: 'text-blue-600' },
    { label: 'In Process', count: 15, color: 'text-blue-600' },
    { label: 'Routing', count: 5, color: 'text-purple-600' },
    { label: 'Ready', count: 32, color: 'text-green-600' }
  ]

  const reworkData = [
    { label: 'On Hold', count: 3, color: 'text-yellow-600' },
    { label: 'Pending', count: 7, color: 'text-orange-600' },
    { label: 'Inbox', count: 12, color: 'text-blue-600' },
    { label: 'In Process', count: 9, color: 'text-blue-600' },
    { label: 'Ready', count: 18, color: 'text-green-600' }
  ]

  const supportData = [
    { label: 'On Hold', count: 5, color: 'text-yellow-600' },
    { label: 'Pending', count: 11, color: 'text-orange-600' },
    { label: 'Inbox', count: 8, color: 'text-blue-600' },
    { label: 'In Process', count: 14, color: 'text-blue-600' },
    { label: 'Ready', count: 22, color: 'text-green-600' }
  ]

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

      {/* Time Zone Display */}
      <TimeZoneDisplay />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Select Date for Products:</label>
              <input
                type="date"
                value={productsDate}
                onChange={(e) => setProductsDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: '600' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inbound Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Inbound</h3>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Select Date for Inbound:</label>
              <input
                type="date"
                value={inboundDate}
                onChange={(e) => setInboundDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inboundData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: '600' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Warehouse Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">Warehouse</h3>
        <div className="grid grid-cols-1 gap-2">
          {warehouseData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className={`text-base font-bold ${item.color}`}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metric Boxes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outbound Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Outbound</h3>
          <div className="space-y-3">
            {outboundData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rework Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rework</h3>
          <div className="space-y-3">
            {reworkData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Support Box */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
          <div className="space-y-3">
            {supportData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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