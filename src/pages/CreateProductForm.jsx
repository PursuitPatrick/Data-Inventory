import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CreateProductForm = () => {
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

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Mock UOM data
  const [uomData] = useState([
    {
      id: 1,
      uomNumber: 'EA',
      isActive: true,
      uomType: 'Each',
      uomQty: 1,
      weight: 0.5,
      whsInsuranceValue: 10.00,
      shippingInsuranceValue: 15.00,
      billingUnits: 1,
      length: 5,
      width: 3,
      height: 2,
      cube: 30,
      alias1: 'Piece',
      alias2: 'Unit',
      alias3: 'Item'
    },
    {
      id: 2,
      uomNumber: 'BOX',
      isActive: true,
      uomType: 'Box',
      uomQty: 12,
      weight: 6.0,
      whsInsuranceValue: 120.00,
      shippingInsuranceValue: 180.00,
      billingUnits: 1,
      length: 12,
      width: 8,
      height: 6,
      cube: 576,
      alias1: 'Case',
      alias2: 'Carton',
      alias3: 'Pack'
    }
  ])

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
    
    // Real-time validation for required fields
    if (['clientId', 'skuCode', 'description', 'descriptionForCustoms', 'hsCode'].includes(field)) {
      validateField(field, value)
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Create Product</h1>
          <p className="text-sm text-gray-600 mb-2">
            Manually enter product details to create a new product entry.
          </p>
                 
          {/* Caution Message */}
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-6">
            <span>⚠️</span>
            <span>Please enter the information for the product you would like to create.</span>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          {/* Single Column Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form className="space-y-4">
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
                  <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
                  <option value="CLI-001">CLI-001 – WestCo Distribution</option>
                  <option value="CLI-002">CLI-002 – Metro Supplies</option>
                </select>
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
                  <span className="text-xs text-gray-500">Stock keeping unit code</span>
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
                  <span className="text-xs text-gray-500">Product description</span>
                </div>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={() => handleBlur('description')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Description For Customs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description For Customs <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">Customs description</span>
                </div>
                <input
                  type="text"
                  value={formData.descriptionForCustoms}
                  onChange={(e) => handleInputChange('descriptionForCustoms', e.target.value)}
                  onBlur={() => handleBlur('descriptionForCustoms')}
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
                  <span className="text-xs text-gray-500">Harmonized System code</span>
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
                  <span className="text-xs text-gray-500">Product origin country</span>
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
                  <span className="text-xs text-gray-500">Reference field 1</span>
                </div>
                <input
                  type="text"
                  value={formData.ref1}
                  onChange={(e) => handleInputChange('ref1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Ref1"
                />
              </div>

              {/* Ref2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Ref2</label>
                  <span className="text-xs text-gray-500">Reference field 2</span>
                </div>
                <input
                  type="text"
                  value={formData.ref2}
                  onChange={(e) => handleInputChange('ref2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Ref2"
                />
              </div>

              {/* Ref3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Ref3</label>
                  <span className="text-xs text-gray-500">Reference field 3</span>
                </div>
                <input
                  type="text"
                  value={formData.ref3}
                  onChange={(e) => handleInputChange('ref3', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Ref3"
                />
              </div>

              {/* Ref4 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Ref4</label>
                  <span className="text-xs text-gray-500">Reference field 4</span>
                </div>
                <input
                  type="text"
                  value={formData.ref4}
                  onChange={(e) => handleInputChange('ref4', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Ref4"
                />
              </div>

              {/* Ref5 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Ref5</label>
                  <span className="text-xs text-gray-500">Reference field 5</span>
                </div>
                <input
                  type="text"
                  value={formData.ref5}
                  onChange={(e) => handleInputChange('ref5', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Ref5"
                />
              </div>
            </form>
          </div>

          {/* Units of Measure Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Units of Measure</h2>
            </div>
            
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Active</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UOM Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Whs Insurance Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Insurance Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Width</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cube</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias 1</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias 2</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias 3</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uomData.map((uom) => (
                    <tr key={uom.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.uomNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          uom.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {uom.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.uomType}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.uomQty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.weight}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${uom.whsInsuranceValue.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${uom.shippingInsuranceValue.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.billingUnits}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.length}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.width}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.height}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.cube}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.alias1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.alias2}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{uom.alias3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isFormValid()}
              onClick={handleSave}
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                isFormValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProductForm 