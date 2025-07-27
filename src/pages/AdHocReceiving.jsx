import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AdHocReceiving = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    clientId: '',
    dc: '',
    carriers: '',
    shippingMethod: '',
    rushPO: '',
    poNum: '',
    supplier: '',
    trackingNum: '',
    expArrivalDate: '',
    skuAliasValues: ''
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
    validateField(field, formData[field])
  }

  const validateField = (field, value) => {
    const requiredFields = ['clientId', 'dc', 'poNum']
    
    if (requiredFields.includes(field) && !value.trim()) {
      setErrors(prev => ({
        ...prev,
        [field]: 'This field is required'
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const requiredFields = ['clientId', 'dc', 'poNum']
    const newErrors = {}
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormValid = () => {
    const requiredFields = ['clientId', 'dc', 'poNum']
    return requiredFields.every(field => formData[field].trim() !== '')
  }

  const handleSave = () => {
    if (validateForm()) {
      console.log('AdHoc Receiving form data:', formData)
      // TODO: Add save logic
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AdHoc Receiving</h1>
      <p className="text-sm text-gray-600 mb-2">
        Create purchase orders on-the-fly during receiving processes.
      </p>
      
      {/* Caution Message */}
      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-4">
        <span>⚠️</span>
        <span>Ad Hoc Receiving Page allows you to scan the SKU or Alias values (1 per row) into the box below. The hub will consolidate the count of duplicates and create a PO.</span>
      </div>

      {/* PO Information Section Header */}
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📦</span>
            PO Information
          </h2>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <form className="space-y-4">
          {/* Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Date
              </label>
              <span className="text-xs text-gray-500">Date of the receiving transaction</span>
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Client ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Client ID <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Unique identifier for the client</span>
            </div>
            <input
              type="text"
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              onBlur={() => handleBlur('clientId')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client ID"
            />
            {errors.clientId && (
              <p className="text-red-600 text-xs mt-1">{errors.clientId}</p>
            )}
          </div>

          {/* DC */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                DC <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Distribution center identifier</span>
            </div>
            <input
              type="text"
              value={formData.dc}
              onChange={(e) => handleInputChange('dc', e.target.value)}
              onBlur={() => handleBlur('dc')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dc ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter DC"
            />
            {errors.dc && (
              <p className="text-red-600 text-xs mt-1">{errors.dc}</p>
            )}
          </div>

          {/* Carriers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Carriers</label>
              <span className="text-xs text-gray-500">Shipping carrier information</span>
            </div>
            <input
              type="text"
              value={formData.carriers}
              onChange={(e) => handleInputChange('carriers', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter carriers"
            />
          </div>

          {/* Shipping Method */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Shipping Method</label>
              <span className="text-xs text-gray-500">Method of shipment</span>
            </div>
            <input
              type="text"
              value={formData.shippingMethod}
              onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter shipping method"
            />
          </div>

          {/* Rush PO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Rush PO</label>
              <span className="text-xs text-gray-500">Rush purchase order indicator</span>
            </div>
            <input
              type="text"
              value={formData.rushPO}
              onChange={(e) => handleInputChange('rushPO', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter rush PO"
            />
          </div>

          {/* PO Num */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                PO Num <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Purchase order number</span>
            </div>
            <input
              type="text"
              value={formData.poNum}
              onChange={(e) => handleInputChange('poNum', e.target.value)}
              onBlur={() => handleBlur('poNum')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.poNum ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter PO number"
            />
            {errors.poNum && (
              <p className="text-red-600 text-xs mt-1">{errors.poNum}</p>
            )}
          </div>

          {/* Supplier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Supplier</label>
              <span className="text-xs text-gray-500">Supplier information</span>
            </div>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter supplier"
            />
          </div>

          {/* Tracking Num */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Tracking Num</label>
              <span className="text-xs text-gray-500">Tracking number for shipment</span>
            </div>
            <input
              type="text"
              value={formData.trackingNum}
              onChange={(e) => handleInputChange('trackingNum', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tracking number"
            />
          </div>

          {/* EXP Arrival Date */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">EXP Arrival Date</label>
              <span className="text-xs text-gray-500">Expected arrival date</span>
            </div>
            <input
              type="date"
              value={formData.expArrivalDate}
              onChange={(e) => handleInputChange('expArrivalDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* PO SKUs Section Header */}
          <div className="mb-6 mt-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 w-full max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📦</span>
                PO SKUs
              </h2>
            </div>
          </div>

          {/* SKU/Alias Values Input */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Enter / Scan the SKU or Alias values (1 per row)</label>
              <span className="text-xs text-gray-500">Scan or type one entry per line</span>
            </div>
            <textarea
              value={formData.skuAliasValues}
              onChange={(e) => handleInputChange('skuAliasValues', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Scan or type one SKU or Alias per line..."
            />
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Exit Without Saving
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isFormValid()}
          className={`px-4 py-2 rounded ${
            isFormValid() 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit AdHoc PO
        </button>
      </div>
    </div>
  )
}

export default AdHocReceiving 