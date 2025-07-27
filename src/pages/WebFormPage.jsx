import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const WebFormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    date: '',
    clientId: '',
    dc: '',
    rushPO: '',
    poNum: '',
    supplier: '',
    expArrivalDate: ''
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
    const requiredFields = ['clientId', 'dc', 'poNum', 'expArrivalDate']
    
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
    const requiredFields = ['clientId', 'dc', 'poNum', 'expArrivalDate']
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
    const requiredFields = ['clientId', 'skuCode', 'description', 'descriptionForCustoms', 'hsCode']
    return requiredFields.every(field => formData[field].trim() !== '')
  }

  const handleSave = () => {
    if (validateForm()) {
      console.log('Form data:', formData)
      console.log('UOM data:', uomData)
      // TODO: Add save logic
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div>
                       <h1 className="text-2xl font-bold mb-2">Create PO</h1>
                 <p className="text-sm text-gray-600 mb-2">
                   Manually enter product details to create a new product entry.
                 </p>
                 
                 {/* Caution Message */}
                 <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-6">
                   <span>⚠️</span>
                   <span>Please enter the information on the PO you would like to create.</span>
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
              <label className="text-sm font-medium text-gray-700">Date</label>
              <span className="text-xs text-gray-500">Date of the purchase order</span>
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
            <select
              value={formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              onBlur={() => handleBlur('clientId')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Client ID...</option>
              <option value="CLI-001">CLI-001 – WestCo Distribution</option>
              <option value="CLI-002">CLI-002 – Metro Supplies</option>
            </select>
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
            <select
              value={formData.dc}
              onChange={(e) => handleInputChange('dc', e.target.value)}
              onBlur={() => handleBlur('dc')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dc ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select DC...</option>
              <option value="Fort Lauderdale, Florida">Fort Lauderdale, Florida</option>
              <option value="Bronx, NY">Bronx, NY</option>
            </select>
            {errors.dc && (
              <p className="text-red-600 text-xs mt-1">{errors.dc}</p>
            )}
          </div>

          {/* RushPO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">RushPO</label>
              <span className="text-xs text-gray-500">Rush purchase order indicator</span>
            </div>
            <select
              value={formData.rushPO}
              onChange={(e) => handleInputChange('rushPO', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Option...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* PONum */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                PONum <span className="text-red-500">*</span>
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

          {/* ExpArrivalDate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                ExpArrivalDate <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Expected arrival date</span>
            </div>
            <input
              type="date"
              value={formData.expArrivalDate}
              onChange={(e) => handleInputChange('expArrivalDate', e.target.value)}
              onBlur={() => handleBlur('expArrivalDate')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.expArrivalDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expArrivalDate && (
              <p className="text-red-600 text-xs mt-1">{errors.expArrivalDate}</p>
            )}
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => navigate('/inventory/products')}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Exit Without Saving
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('Create PO clicked')
            console.log('Form data:', formData)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create PO
        </button>
      </div>
    </div>
  )
}

export default WebFormPage 