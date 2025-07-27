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
  const [selectedShippingType, setSelectedShippingType] = useState('')
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('')

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

  const handleShippingTypeClick = (shippingType) => {
    setSelectedShippingType(prev => prev === shippingType ? '' : shippingType)
  }

  const handleShippingMethodChange = (value) => {
    setSelectedShippingMethod(value)
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

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

                  {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Column - PO Information */}
              <div className="w-full">
          {/* PO Information Section Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📦</span>
              PO Information
            </h2>
          </div>

          {/* PO Information Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
        </div>

                      {/* Middle Column - Shipping Details */}
              <div className="w-full">
          {/* Shipping Details Section Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">🚚</span>
              Shipping Details
            </h2>
          </div>

          {/* Shipping Details Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Step 1 Subsection */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                <span className="mr-2">📤</span>
                Step 1 – What are you sending?
              </h3>
              
              {/* Selection Boxes */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div 
                  onClick={() => handleShippingTypeClick('Boxes')}
                  className={`border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer ${
                    selectedShippingType === 'Boxes'
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700">Boxes</div>
                </div>
                <div 
                  onClick={() => handleShippingTypeClick('Pallets')}
                  className={`border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer ${
                    selectedShippingType === 'Pallets'
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700">Pallets (LTL / FTL)</div>
                </div>
                <div 
                  onClick={() => handleShippingTypeClick('Container')}
                  className={`border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer ${
                    selectedShippingType === 'Container'
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700">Container 20/40</div>
                </div>
                <div 
                  onClick={() => handleShippingTypeClick('Other')}
                  className={`border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer ${
                    selectedShippingType === 'Other'
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700">Other</div>
                </div>
              </div>

              {/* Step 2 Subsection */}
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                  <span className="mr-2">📊</span>
                  Step 2 – How Many?
                </h3>
                
                {/* Quantity Input */}
                <div className="mb-4">
                  <input
                    type="number"
                    disabled={!selectedShippingType}
                    placeholder={
                      selectedShippingType === 'Boxes' ? 'Enter Quantity of Boxes' :
                      selectedShippingType === 'Pallets' ? 'Enter Quantity of Pallets' :
                      selectedShippingType === 'Container' ? 'Enter Quantity of Containers' :
                      selectedShippingType === 'Other' ? 'Enter Quantity' :
                      'Select a shipping type above first'
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      selectedShippingType 
                        ? 'border-gray-300' 
                        : 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    min="1"
                    step="1"
                  />
                </div>

                {/* Step 3 Subsection */}
                <div className="mt-8">
                  <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                    <span className="mr-2">🚚</span>
                    Step 3 – How are you sending?
                  </h3>
                  
                  {/* Shipping Method Dropdown */}
                  <div className="mb-4">
                    <select
                      disabled={!formData.dc || formData.dc === 'Select DC...'}
                      value={selectedShippingMethod}
                      onChange={(e) => handleShippingMethodChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.dc || formData.dc === 'Select DC...'
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="" disabled>
                        {!formData.dc || formData.dc === 'Select DC...' 
                          ? 'Select DC to unlock shipping methods' 
                          : 'Select a shipping method'
                        }
                      </option>
                      <option value="DHLE">DHLE – DHL e-Commerce</option>
                      <option value="FDXE">FDXE – (Fedex Express)</option>
                      <option value="FDGX">FDGX – (Fedex Ground)</option>
                      <option value="FDXSMARTPOST">FDXSMARTPOST – (Fedex SmartPost)</option>
                      <option value="LTL">LTL – (Less-Than-Truckload)</option>
                      <option value="PUROLATOR">PUROLATOR – Purolator</option>
                      <option value="REWORK">REWORK – REWORK</option>
                      <option value="TBR">TBR – To Be Routed</option>
                      <option value="UPS">UPS – UPS (United Parcel Service)</option>
                      <option value="UPSSP">UPSSP – UPS SurePost</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tracking Details */}
        <div className="w-full">
          {/* Tracking Details Section Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-2">📦</span>
              Tracking Details
            </h2>
          </div>
          
          {/* Tracking Details Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {/* Container Number Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Scan The Numbers Of The Container</label>
                  <span className="text-xs text-gray-500">Container identification</span>
                </div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Scan or enter container number"
                />
              </div>
            </div>
          </div>
        </div>
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