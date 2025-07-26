import { useState } from 'react'
import { Plus, Ship, Clock, CheckCircle, Printer, MapPin, Package } from 'lucide-react'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mockOutgoingShipments = [
  {
    id: 'SHIP-001',
    orderId: 'ORD-2024-001',
    customer: 'TechCorp',
    items: [
      { name: 'Circuit Boards', quantity: 25, sku: 'PCB-001' },
      { name: 'Sensors', quantity: 50, sku: 'SENSOR-001' }
    ],
    totalItems: 75,
    destination: '123 Tech Street, Silicon Valley, CA 94025',
    shipDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'shipped',
    trackingNumber: '1Z999AA1234567890',
    carrier: 'FedEx',
    shipper: 'Sarah Johnson',
    notes: 'Express shipping requested'
  },
  {
    id: 'SHIP-002',
    orderId: 'ORD-2024-002',
    customer: 'AutoParts Inc',
    items: [
      { name: 'Sensors', quantity: 75, sku: 'SENSOR-001' }
    ],
    totalItems: 75,
    destination: '456 Auto Drive, Detroit, MI 48201',
    shipDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    status: 'pending',
    trackingNumber: null,
    carrier: 'UPS',
    shipper: null,
    notes: 'Standard ground shipping'
  },
  {
    id: 'SHIP-003',
    orderId: 'ORD-2024-003',
    customer: 'Manufacturing Co',
    items: [
      { name: 'Steel Pipes', quantity: 100, sku: 'STL-PIPE-001' },
      { name: 'Aluminum Sheets', quantity: 50, sku: 'AL-SHEET-001' }
    ],
    totalItems: 150,
    destination: '789 Factory Blvd, Chicago, IL 60601',
    shipDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    status: 'shipped',
    trackingNumber: '1Z999AA1234567891',
    carrier: 'DHL',
    shipper: 'Mike Wilson',
    notes: 'Fragile items - handle with care'
  },
  {
    id: 'SHIP-004',
    orderId: 'ORD-2024-004',
    customer: 'Electronics Store',
    items: [
      { name: 'LED Panels', quantity: 30, sku: 'LED-PANEL-001' }
    ],
    totalItems: 30,
    destination: '321 Retail Ave, New York, NY 10001',
    shipDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
    status: 'pending',
    trackingNumber: null,
    carrier: 'USPS',
    shipper: null,
    notes: 'Customer requested signature confirmation'
  }
]

const Shipping = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const columns = [
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true
    },
    {
      key: 'totalItems',
      label: 'Items',
      sortable: true,
      render: (value, item) => (
        <div className="text-center">
          <span className="font-medium">{value}</span>
          <div className="text-xs text-gray-500">
            {item.items.length} types
          </div>
        </div>
      )
    },
    {
      key: 'destination',
      label: 'Destination',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="truncate max-w-xs">{value}</span>
        </div>
      )
    },
    {
      key: 'shipDate',
      label: 'Ship Date',
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
          'shipped': {
            label: 'Shipped',
            icon: CheckCircle,
            className: 'bg-success-50 text-success-700 border-success-200'
          },
          'in-transit': {
            label: 'In Transit',
            icon: Ship,
            className: 'bg-primary-50 text-primary-700 border-primary-200'
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
      key: 'trackingNumber',
      label: 'Tracking',
      sortable: true,
      render: (value) => value || '-'
    }
  ]

  const handleShipItems = (shipment) => {
    setSelectedShipment(shipment)
    setIsModalOpen(true)
  }

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment)
    setIsModalOpen(true)
  }

  const handlePrintLabel = (shipment) => {
    // TODO: Implement label printing
    console.log('Print label for:', shipment)
    alert('Label printing functionality would be implemented here')
  }

  const filteredData = filterStatus === 'all' 
    ? mockOutgoingShipments 
    : mockOutgoingShipments.filter(shipment => shipment.status === filterStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
          <p className="text-gray-600">Manage outgoing shipments and track deliveries.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Shipment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Ship className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{mockOutgoingShipments.length}</p>
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
                {mockOutgoingShipments.filter(s => s.status === 'pending').length}
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
              <p className="text-sm font-medium text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockOutgoingShipments.filter(s => s.status === 'shipped').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockOutgoingShipments.filter(s => s.status === 'in-transit').length}
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
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrier
            </label>
            <select className="input-field w-auto">
              <option value="">All Carriers</option>
              <option value="fedex">FedEx</option>
              <option value="ups">UPS</option>
              <option value="dhl">DHL</option>
              <option value="usps">USPS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outgoing Shipments Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        onView={handleViewDetails}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
      />

      {/* Ship Items Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedShipment(null)
        }}
        title={selectedShipment ? 'Ship Items' : 'New Shipment'}
        size="xl"
      >
        <ShippingForm
          shipment={selectedShipment}
          onSave={(data) => {
            console.log('Save shipment:', data)
            setIsModalOpen(false)
            setSelectedShipment(null)
          }}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedShipment(null)
          }}
          onPrintLabel={handlePrintLabel}
        />
      </Modal>
    </div>
  )
}

// Shipping Form Component
const ShippingForm = ({ shipment, onSave, onCancel, onPrintLabel }) => {
  const [formData, setFormData] = useState({
    orderId: shipment?.orderId || '',
    customer: shipment?.customer || '',
    items: shipment?.items || [{ name: '', quantity: 0, sku: '' }],
    destination: shipment?.destination || '',
    shipDate: new Date().toISOString().split('T')[0],
    carrier: shipment?.carrier || 'FedEx',
    trackingNumber: shipment?.trackingNumber || '',
    shipper: '',
    notes: shipment?.notes || ''
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
      items: [...prev.items, { name: '', quantity: 0, sku: '' }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order ID *
          </label>
          <input
            type="text"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer *
          </label>
          <input
            type="text"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ship Date *
          </label>
          <input
            type="date"
            name="shipDate"
            value={formData.shipDate}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipper Name *
          </label>
          <input
            type="text"
            name="shipper"
            value={formData.shipper}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier *
          </label>
          <select
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="FedEx">FedEx</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="USPS">USPS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destination Address *
        </label>
        <textarea
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          rows={3}
          className="input-field"
          placeholder="Enter complete shipping address..."
          required
        />
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
                  SKU
                </label>
                <input
                  type="text"
                  value={item.sku}
                  onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  className="input-field"
                  min="1"
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
          placeholder="Any special instructions or notes..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        {shipment && (
          <button
            type="button"
            onClick={() => onPrintLabel(shipment)}
            className="btn-secondary flex items-center"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Label
          </button>
        )}
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
          {shipment ? 'Update Shipment' : 'Create Shipment'}
        </button>
      </div>
    </form>
  )
}

export default Shipping 