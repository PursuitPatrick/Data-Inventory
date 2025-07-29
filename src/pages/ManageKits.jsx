import { useState } from 'react'
import { Download, Plus, ArrowLeft, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ManageKits = () => {
  const navigate = useNavigate()
  
    // State for dropdown visibility
  const [workOrdersOpen, setWorkOrdersOpen] = useState(false)
  const [kittingAssemblyOpen, setKittingAssemblyOpen] = useState(false)

  // State for search fields
  const [clientId, setClientId] = useState('')
  const [skus, setSkus] = useState('')

  // Dropdown options
  const workOrdersOptions = [
    { label: 'Manage Orders', path: '/rework' },
    { label: 'Create Work Orders', path: '/rework/create-work-orders' }
  ]

  const kittingAssemblyOptions = [
    { label: 'Manage Kits', path: '/rework/manage-kits' }
  ]

  return (
    <div className="p-6">
      <div className="space-y-6">
                        {/* Top Navigation Dropdowns */}
                <div className="flex space-x-4">
                  {/* Work Orders Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setWorkOrdersOpen(!workOrdersOpen)}
                      className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span>Work Orders</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${workOrdersOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {workOrdersOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        <div className="py-1">
                          {workOrdersOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setWorkOrdersOpen(false)
                                navigate(option.path)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Kitting & Assembly Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setKittingAssemblyOpen(!kittingAssemblyOpen)}
                      className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span>Kitting & Assembly</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${kittingAssemblyOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {kittingAssemblyOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        <div className="py-1">
                          {kittingAssemblyOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setKittingAssemblyOpen(false)
                                navigate(option.path)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Kits</h1>
              <p className="text-sm text-gray-600">View and manage all kits</p>
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
          
          {/* Right side - Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => console.log("Export kits")}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button 
              onClick={() => navigate('/kits/create')}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </button>
          </div>
        </div>

                        {/* Search Fields and Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Client ID Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="Enter Client ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* SKUs Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKUs
                    </label>
                    <input
                      type="text"
                      value={skus}
                      onChange={(e) => setSkus(e.target.value)}
                      placeholder="Enter SKUs"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Get # Of Kits Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => console.log("Get number of kits")}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      Get # Of Kits
                    </button>
                  </div>

                  {/* Clear Search Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setClientId('')
                        setSkus('')
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200 shadow-sm"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>

        {/* Table Header */}
        <div className="bg-gray-800 text-white px-4 py-2 grid grid-cols-5 text-sm font-medium">
          <div>#</div>
          <div>SKU</div>
          <div>Description</div>
          <div>QTY Per Kit</div>
          <div>QTY Available</div>
        </div>
      </div>
    </div>
  )
}

export default ManageKits 