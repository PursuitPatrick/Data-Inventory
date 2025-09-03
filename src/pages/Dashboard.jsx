import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, Ship, TrendingUp, Clock, User, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../components/StatCard'
import TimeZoneDisplay from '../components/TimeZoneDisplay'
import { formatDateTime } from '../utils/dateUtils'
import { api } from '../api/client'

const numberFmt = (n) => new Intl.NumberFormat().format(Number(n || 0))

const mapActivityType = (type, title='') => {
  const t = String(type || '').toLowerCase()
  if (t.includes('inbound') || t.includes('receive')) return 'received'
  if (t.includes('outbound') || t.includes('ship')) return 'shipped'
  return 'updated'
}

const Dashboard = () => {
  const navigate = useNavigate()
  const SHOPIFY_STORE = import.meta.env.VITE_SHOPIFY_STORE || ''
  const shopifyStoreSlug = SHOPIFY_STORE
    .replace(/^https?:\/\//, '')
    .replace(/\.myshopify\.com$/, '')
    .replace(/\/$/, '')
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [productsDate, setProductsDate] = useState(new Date().toISOString().split('T')[0])
  const [inboundDate, setInboundDate] = useState(new Date().toISOString().split('T')[0])

  const [stats, setStats] = useState([])
  const [productsData, setProductsData] = useState([])
  const [inboundData, setInboundData] = useState([])
  const [warehouseData, setWarehouseData] = useState([])
  const [outOfStock, setOutOfStock] = useState([])
  const [outboundData, setOutboundData] = useState([])
  const [reworkData, setReworkData] = useState([])
  const [supportData, setSupportData] = useState([])
  const [activityItems, setActivityItems] = useState([])

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const d = await api('/api/summary/dashboard')
        const cards = [
          { title: 'Total Inventory', value: numberFmt(d.totalInventory?.value), change: d.totalInventory?.pctFromLastMonth != null ? `${Math.round(d.totalInventory.pctFromLastMonth)}%` : '—', changeType: (d.totalInventory?.pctFromLastMonth || 0) >= 0 ? 'increase' : 'decrease', icon: Package, color: 'primary' },
          { title: 'Incoming Items', value: numberFmt(d.incomingItems?.value), change: '+', changeType: 'increase', icon: Truck, color: 'success' },
          { title: 'Outgoing Items', value: numberFmt(d.outgoingItems?.value), change: '+', changeType: 'increase', icon: Ship, color: 'warning' },
          { title: 'Items in Transit', value: numberFmt(d.itemsInTransit?.value), change: '+', changeType: 'increase', icon: TrendingUp, color: 'primary' },
        ]
        setStats(cards)
      } catch {}
    }

    const loadWarehouse = async () => {
      try {
        const w = await api('/api/summary/warehouse?lowThreshold=5')
        setWarehouseData([
          { label: 'All Boxes', count: w.allBoxes || 0, color: 'text-gray-700' },
          { label: 'In Stock', count: w.inStock || 0, color: 'text-green-600' },
          { label: 'Low Stock', count: w.lowStock || 0, color: 'text-yellow-600' },
          { label: 'Out Of Stock', count: w.outOfStock || 0, color: 'text-red-600' },
        ])
        const list = await api('/api/summary/out-of-stock?limit=100')
        setOutOfStock(Array.isArray(list) ? list : [])
      } catch {}
    }

    const loadActivity = async () => {
      try {
        const res = await api('/api/admin/activity?limit=5')
        const items = (res.items || []).map(x => ({
          id: x.id,
          type: mapActivityType(x.type, x.title),
          message: x.title || x.details || 'Activity',
          user: x.actor || '—',
          timestamp: new Date(x.occurred_at),
        }))
        setActivityItems(items)
      } catch {}
    }

    loadDashboard()
    loadWarehouse()
    loadActivity()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const p = await api('/api/summary/products-by-status')
        const active = Number(p.active || 0)
        const inactive = Number(p.inactive || 0)
        const onHold = Number(p.on_hold || 0)
        const all = active + inactive + onHold + Number(p.unknown || 0)
        setProductsData([
          { name: 'On Hold', value: onHold },
          { name: 'Active', value: active },
          { name: 'Inactive', value: inactive },
          { name: "ALL SKU's", value: all },
        ])
      } catch {}
    }
    loadProducts()
  }, [productsDate])

  useEffect(() => {
    const mapByStatus = (rows, labels) => {
      const m = Object.fromEntries((rows || []).map(r => [String(r.status || '').toLowerCase(), Number(r.count || 0)]))
      return labels.map(label => ({ name: label, value: m[label.toLowerCase()] || 0 }))
    }
    const loadInbound = async () => {
      try {
        const rows = await api(`/api/inbound/summary?date=${inboundDate}`)
        setInboundData(mapByStatus(rows, ['On Hold','Expected','Rework','In Process']))
      } catch {}
    }
    const loadOutbound = async () => {
      try {
        const rows = await api('/api/outbound/summary')
        const mapped = (rows || []).map(r => ({ label: r.status || 'unknown', count: Number(r.count || 0), color: 'text-blue-600' }))
        setOutboundData(mapped)
      } catch {}
    }
    const loadRework = async () => {
      try {
        const rows = await api('/api/rework/summary')
        const mapped = (rows || []).map(r => ({ label: r.status || 'unknown', count: Number(r.count || 0), color: 'text-blue-600' }))
        setReworkData(mapped)
      } catch {}
    }
    const loadSupport = async () => {
      try {
        const rows = await api('/api/support/summary')
        const mapped = (rows || []).map(r => ({ label: r.status || 'unknown', count: Number(r.count || 0), color: 'text-blue-600' }))
        setSupportData(mapped)
      } catch {}
    }
    loadInbound()
    loadOutbound()
    loadRework()
    loadSupport()
  }, [inboundDate])

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
        {stats.map((stat, index) => (
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
        <div className="grid grid-cols-1 gap-2 mb-3">
          {warehouseData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className={`text-base font-bold ${item.color}`}>{item.count}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Out of stock ({outOfStock.length})</h4>
          {outOfStock.length === 0 ? (
            <p className="text-sm text-gray-500">No items are out of stock.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-auto pr-1">
              {outOfStock.map((it) => (
                <div key={`${it.inventory_item_id}`} className="flex items-center justify-between text-sm bg-gray-50 rounded-md px-2 py-1">
                  <div className="truncate mr-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/products/details/${encodeURIComponent(it.sku || it.product_id || it.inventory_item_id)}`)}
                      className="font-medium text-primary-600 hover:underline mr-2"
                    >
                      {it.sku || '—'}
                    </button>
                    <span className="text-gray-600 truncate mr-2">{it.variant_title || 'Variant'}</span>
                    {shopifyStoreSlug && it.product_id ? (
                      <a
                        href={`https://admin.shopify.com/store/${shopifyStoreSlug}/products/${it.product_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Open in Shopify
                      </a>
                    ) : null}
                  </div>
                  <span className="text-red-600 font-semibold">0</span>
                </div>
              ))}
            </div>
          )}
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
          {activityItems.map((activity) => (
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
                    <span className="text-xs text-gray-500">{formatDateTime(activity.timestamp)}</span>
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