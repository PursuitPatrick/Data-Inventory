import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const WebFormPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    clientId: '',
    skuCode: '',
    description: '',
    descriptionForCustoms: '',
    hsCode: '',
    countryOfOrigin: '',
    ref1: '',
    ref2: '',
    ref3: '',
    ref4: '',
    ref5: ''
  })
  const [uomData, setUomData] = useState({
    uomNumber: '',
    isActive: '',
    uomType: '',
    uomQty: '',
    weight: '',
    whsInsuranceValue: '',
    shippingInsuranceValue: '',
    billingUnits: '',
    length: '',
    width: '',
    height: '',
    cube: '',
    alias1: '',
    alias2: '',
    alias3: ''
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

  const handleUomChange = (field, value) => {
    setUomData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
    validateField(field, formData[field])
  }

  const validateField = (field, value) => {
    const requiredFields = ['clientId', 'skuCode', 'description', 'descriptionForCustoms', 'hsCode']
    
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
    const requiredFields = ['clientId', 'skuCode', 'description', 'descriptionForCustoms', 'hsCode']
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
                       <h1 className="text-2xl font-bold mb-2">Create SKU</h1>
                 <p className="text-sm text-gray-600 mb-2">
                   Manually enter product details to create a new product entry.
                 </p>
                 
                 {/* Caution Message */}
                 <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-6">
                   <span>⚠️</span>
                   <span>Please enter the information on the SKU you would like to Create SKU.</span>
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

          {/* SKU Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                SKU Code <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Stock keeping unit identifier</span>
            </div>
            <input
              type="text"
              value={formData.skuCode}
              onChange={(e) => handleInputChange('skuCode', e.target.value)}
              onBlur={() => handleBlur('skuCode')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.skuCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter SKU code"
            />
            {errors.skuCode && (
              <p className="text-red-600 text-xs mt-1">{errors.skuCode}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Product description for internal use</span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Description for Customs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Description for Customs <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Customs declaration description</span>
            </div>
            <textarea
              value={formData.descriptionForCustoms}
              onChange={(e) => handleInputChange('descriptionForCustoms', e.target.value)}
              onBlur={() => handleBlur('descriptionForCustoms')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.descriptionForCustoms ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customs description"
            />
            {errors.descriptionForCustoms && (
              <p className="text-red-600 text-xs mt-1">{errors.descriptionForCustoms}</p>
            )}
          </div>

          {/* HS Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                HS Code <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">Harmonized System classification code</span>
            </div>
            <input
              type="text"
              value={formData.hsCode}
              onChange={(e) => handleInputChange('hsCode', e.target.value)}
              onBlur={() => handleBlur('hsCode')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.hsCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter HS code"
            />
            {errors.hsCode && (
              <p className="text-red-600 text-xs mt-1">{errors.hsCode}</p>
            )}
          </div>

          {/* Country of Origin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Country of Origin</label>
              <span className="text-xs text-gray-500">Country where product was manufactured</span>
            </div>
            <input
              type="text"
              value={formData.countryOfOrigin}
              onChange={(e) => handleInputChange('countryOfOrigin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter country of origin"
            />
          </div>

          {/* Ref1 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ref1</label>
              <span className="text-xs text-gray-500">Reference field 1 for additional data</span>
            </div>
            <input
              type="text"
              value={formData.ref1}
              onChange={(e) => handleInputChange('ref1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference 1"
            />
          </div>

          {/* Ref2 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ref2</label>
              <span className="text-xs text-gray-500">Reference field 2 for additional data</span>
            </div>
            <input
              type="text"
              value={formData.ref2}
              onChange={(e) => handleInputChange('ref2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference 2"
            />
          </div>

          {/* Ref3 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ref3</label>
              <span className="text-xs text-gray-500">Reference field 3 for additional data</span>
            </div>
            <input
              type="text"
              value={formData.ref3}
              onChange={(e) => handleInputChange('ref3', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference 3"
            />
          </div>

          {/* Ref4 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ref4</label>
              <span className="text-xs text-gray-500">Reference field 4 for additional data</span>
            </div>
            <input
              type="text"
              value={formData.ref4}
              onChange={(e) => handleInputChange('ref4', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference 4"
            />
          </div>

          {/* Ref5 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Ref5</label>
              <span className="text-xs text-gray-500">Reference field 5 for additional data</span>
            </div>
            <input
              type="text"
              value={formData.ref5}
              onChange={(e) => handleInputChange('ref5', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reference 5"
            />
          </div>

          
        </form>
      </div>

      {/* Units of Measure Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-10 w-full">
        <h2 className="text-lg font-semibold mb-4">Units of Measure</h2>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-xs">
            {/* Header Row */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left p-2 font-medium text-gray-700 w-16">UOM #</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Is Active</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">UOM Type</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">UOM Qty</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Weight</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Whs Insurance</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Ship Insurance</th>
                <th className="text-left p-2 font-medium text-gray-700 w-24">Billing Units</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Length</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Width</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Height</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Cube</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Alias 1</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Alias 2</th>
                <th className="text-left p-2 font-medium text-gray-700 w-20">Alias 3</th>
              </tr>
            </thead>
            
            {/* Data Rows */}
            <tbody>
              {/* Each Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value="1"
                    readOnly
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                  />
                </td>
                <td className="p-2">
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Each"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="EA"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>

              {/* Pack Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value="2"
                    readOnly
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                  />
                </td>
                <td className="p-2">
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Pack"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="EA"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>

              {/* Inner Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value="3"
                    readOnly
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                  />
                </td>
                <td className="p-2">
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Inner"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="EA"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>

              {/* Case Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value="4"
                    readOnly
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                  />
                </td>
                <td className="p-2">
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Case"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="EA"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>

              {/* Pallet Row */}
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value="5"
                    readOnly
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                  />
                </td>
                <td className="p-2">
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="Pallet"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    defaultValue="EA"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
              console.log('Create SKU clicked')
              console.log('Form data:', formData)
              console.log('UOM data:', uomData)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create SKU
          </button>
        </div>
      </div>
    </div>
  )
}

export default WebFormPage 