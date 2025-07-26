import { useState } from 'react'
import { Plus, Upload, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mockIncomingOrders = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-001',
    supplier: 'ABC Suppliers',
    items: [
      { name: 'Steel Pipes', quantity: 50, received: 50 },
      { name: 'Aluminum Sheets', quantity: 25, received: 25 }
    ],
    totalItems: 75,
    receivedItems: 75,
    expectedDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'received',
    receiver: 'John Smith',
    notes: 'All items received in good condition'
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-002',
    supplier: 'TechCorp',
    items: [
      { name: 'Circuit Boards', quantity: 100, received: 0 },
      { name: 'Sensors', quantity: 50, received: 0 }
    ],
    totalItems: 150,
    receivedItems: 0,
    expectedDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
    receivedDate: null,
    status: 'pending',
    receiver: null,
    notes: 'Expected delivery next week'
  },
  {
    id: 'PO-003',
    poNumber: 'PO-2024-003',
    supplier: 'XYZ Electronics',
    items: [
      { name: 'LED Panels', quantity: 75, received: 75 }
    ],
    totalItems: 75,
    receivedItems: 75,
    expectedDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    receivedDate: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: 'received',
    receiver: 'Sarah Johnson',
    notes: 'Partial shipment received, balance expected next week'
  },
  {
    id: 'PO-004',
    poNumber: 'PO-2024-004',
    supplier: 'MetalCorp',
    items: [
      { name: 'Aluminum Sheets', quantity: 30, received: 0 }
    ],
    totalItems: 30,
    receivedItems: 0,
    expectedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    receivedDate: null,
    status: 'overdue',
    receiver: null,
    notes: 'Supplier contacted, delivery delayed due to weather'
  }
]

const Receiving = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const columns = [
    {
      key: 'poNumber',
      label: 'PO Number',
      sortable: true
    },
    {
      key: 'supplier',
      label: 'Supplier',
      sortable: true
    },
    {
      key: 'totalItems',
      label: 'Total Items',
      sortable: true,
      render: (value, item) => (
        <div className="text-center">
          <span className="font-medium">{value}</span>
          <div className="text-xs text-gray-500">
            {item.receivedItems} received
          </div>
        </div>
      )
    },
    {
      key: 'expectedDate',
      label: 'Expected Date',
      sortable: true,
      render: (value) => format(value, 'MMM d, yyyy')
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, item) => {
        const statusConfig = {
          'pending': {
            label: 'Pending',
            icon: Clock,
            className: 'bg-warning-50 text-warning-700 border-warning-200'
          },
          'received': {
            label: 'Received',
            icon: CheckCircle,
            className: 'bg-success-50 text-success-700 border-success-200'
          },
          'overdue': {
            label: 'Overdue',
            icon: AlertCircle,
            className: 'bg-danger-50 text-danger-700 border-danger-200'
          }
        }
        const config = statusConfig[value]
        const Icon = config.icon
        return (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
            <Icon className="w-4 h-4 mr-1" />
            {config.label}
          </div>
        )
      }
    },
    {
      key: 'receiver',
      label: 'Receiver',
      sortable: true,
      render: (value) => value || '-'
    }
  ]

  const handleReceiveItems = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const filteredData = filterStatus === 'all' 
    ? mockIncomingOrders 
    : mockIncomingOrders.filter(order => order.status === filterStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receiving</h1>
          <p className="text-gray-600">Manage incoming shipments and purchase orders.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Receipt
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Truck className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockIncomingOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-warning-50 rounded-lg">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncomingOrders.filter(o => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-success-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Received</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncomingOrders.filter(o => o.status === 'received').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-danger-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockIncomingOrders.filter(o => o.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <select className="input-field w-auto">
              <option value="">All Suppliers</option>
              <option value="abc">ABC Suppliers</option>
              <option value="techcorp">TechCorp</option>
              <option value="xyz">XYZ Electronics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incoming Orders Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        onView={handleViewDetails}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
      />

      {/* Receive Items Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        title={selectedOrder ? 'Receive Items' : 'New Receipt'}
        size="xl"
      >
        <ReceivingForm
          order={selectedOrder}
          onSave={(data) => {
            console.log('Save receipt:', data)
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
        />
      </Modal>
    </div>
  )
}

// Receiving Form Component
const ReceivingForm = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    poNumber: order?.poNumber || '',
    supplier: order?.supplier || '',
    items: order?.items || [{ name: '', quantity: 0, received: 0 }],
    receivedDate: new Date().toISOString().split('T')[0],
    receiver: '',
    notes: order?.notes || '',
    packingSlip: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 0, received: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, packingSlip: file }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PO Number *
          </label>
          <input
            type="text"
            name="poNumber"
            value={formData.poNumber}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier *
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Received Date *
          </label>
          <input
            type="date"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receiver Name *
          </label>
          <input
            type="text"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Items</h4>
          <button
            type="button"
            onClick={addItem}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Qty
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received Qty
                </label>
                <input
                  type="number"
                  value={item.received}
                  onChange={(e) => handleItemChange(index, 'received', parseInt(e.target.value))}
                  className="input-field"
                  min="0"
                  max={item.quantity}
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn-danger"
                  disabled={formData.items.length === 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Packing Slip
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            id="packing-slip"
          />
          <label
            htmlFor="packing-slip"
            className="btn-secondary flex items-center cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </label>
          {formData.packingSlip && (
            <span className="text-sm text-gray-600">
              {formData.packingSlip.name}
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input-field"
          placeholder="Any additional notes about this receipt..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {order ? 'Update Receipt' : 'Create Receipt'}
        </button>
      </div>
    </form>
  )
}

export default Receiving 