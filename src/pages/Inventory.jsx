import { useState } from 'react'
import { Plus, Filter, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { format } from 'date-fns'

// Mock data - replace with actual API calls
const mockInventory = [
  {
    id: 'INV-001',
    name: 'Steel Pipes',
    sku: 'STL-PIPE-001',
    quantity: 1250,
    location: 'Zone A / Shelf 3',
    status: 'in-stock',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    category: 'Raw Materials',
    supplier: 'ABC Suppliers',
    minQuantity: 100
  },
  {
    id: 'INV-002',
    name: 'Circuit Boards',
    sku: 'PCB-001',
    quantity: 45,
    location: 'Zone B / Shelf 1',
    status: 'low',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    category: 'Electronics',
    supplier: 'TechCorp',
    minQuantity: 50
  },
  {
    id: 'INV-003',
    name: 'LED Panels',
    sku: 'LED-PANEL-001',
    quantity: 0,
    location: 'Zone C / Shelf 2',
    status: 'reorder',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
    category: 'Electronics',
    supplier: 'XYZ Electronics',
    minQuantity: 25
  },
  {
    id: 'INV-004',
    name: 'Sensors',
    sku: 'SENSOR-001',
    quantity: 320,
    location: 'Zone A / Shelf 4',
    status: 'in-stock',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12),
    category: 'Electronics',
    supplier: 'SensorTech',
    minQuantity: 50
  },
  {
    id: 'INV-005',
    name: 'Aluminum Sheets',
    sku: 'AL-SHEET-001',
    quantity: 15,
    location: 'Zone B / Shelf 5',
    status: 'low',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6),
    category: 'Raw Materials',
    supplier: 'MetalCorp',
    minQuantity: 20
  }
]

const Inventory = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const columns = [
    {
      key: 'id',
      label: 'Item ID',
      sortable: true
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true
    },
    {
      key: 'quantity',
      label: 'Quantity Available',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{value}</span>
          {item.status === 'low' && (
            <span className="text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded">
              Low Stock
            </span>
          )}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const statusClasses = {
          'in-stock': 'status-in-stock',
          'low': 'status-low',
          'reorder': 'status-reorder'
        }
        const statusLabels = {
          'in-stock': 'In Stock',
          'low': 'Low Stock',
          'reorder': 'Reorder'
        }
        return (
          <span className={`status-badge ${statusClasses[value]}`}>
            {statusLabels[value]}
          </span>
        )
      }
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated',
      sortable: true,
      render: (value) => format(value, 'MMM d, h:mm a')
    }
  ]

  const handleView = (item) => {
    navigate(`/item/${item.id}`)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      // TODO: Implement delete logic
      console.log('Delete item:', item)
    }
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const filteredData = filterStatus === 'all' 
    ? mockInventory 
    : mockInventory.filter(item => item.status === filterStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage your warehouse inventory and stock levels.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button onClick={handleAddNew} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
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
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="reorder">Reorder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="input-field w-auto">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="raw-materials">Raw Materials</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <DataTable
        data={filteredData}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
      >
        <InventoryForm
          item={editingItem}
          onSave={(data) => {
            console.log('Save item:', data)
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

// Inventory Form Component
const InventoryForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    category: item?.category || '',
    supplier: item?.supplier || '',
    quantity: item?.quantity || 0,
    minQuantity: item?.minQuantity || 0,
    location: item?.location || '',
    status: item?.status || 'in-stock'
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Tools">Tools</option>
            <option value="Packaging">Packaging</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity Available
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Quantity
          </label>
          <input
            type="number"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleChange}
            className="input-field"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            placeholder="Zone / Shelf"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="reorder">Reorder</option>
          </select>
        </div>
      </div>

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
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}

export default Inventory 