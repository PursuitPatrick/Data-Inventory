import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const CreateSalesOrderForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    shipStartDate: '',
    shipEndDate: '',
    clientId: 'MAGM - MAGM LLC',
    dc: '',
    carriers: '',
    shipMethod: '',
    rushOrder: 'No',
    orderNum: '',
    custPONum: '',
    packSlipComment: '',
    packingIns: '',
    location: '',
    shipToName1: '',
    shipToName2: '',
    shipToAddress1: '',
    shipToAddress2: '',
    shipToCountry: 'United States',
    shipToCity: '',
    shipToStateOrProvince: '',
    shipToZipOrPostalCode: '',
    shipToEmail: '',
    shipToTel: '',
    billToType: '',
    orderCOD: ''
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
    
    // Real-time validation for required fields
    if (['clientId', 'dc', 'orderNum', 'shipToName1', 'shipToAddress1', 'shipToCity', 'shipToStateOrProvince', 'shipToZipOrPostalCode'].includes(field)) {
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
    const requiredFields = ['clientId', 'dc', 'orderNum', 'shipToName1', 'shipToAddress1', 'shipToCity', 'shipToStateOrProvince', 'shipToZipOrPostalCode']
    
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
    const requiredFields = ['clientId', 'dc', 'orderNum', 'shipToName1', 'shipToAddress1', 'shipToCity', 'shipToStateOrProvince', 'shipToZipOrPostalCode']
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
    const requiredFields = ['clientId', 'dc', 'orderNum', 'shipToName1', 'shipToAddress1', 'shipToCity', 'shipToStateOrProvince', 'shipToZipOrPostalCode']
    return requiredFields.every(field => formData[field].trim() !== '')
  }

  const handleSave = () => {
    if (validateForm()) {
      console.log('Sales Order Form data:', formData)
      // TODO: Add save logic for sales order
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Create Sales Order</h1>
          <p className="text-sm text-gray-600 mb-2">
            Manually enter sales order details to create a new order entry.
          </p>
                 
          {/* Caution Message */}
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-6">
            <span>⚠️</span>
            <span>Please enter the information for the sales order you would like to create.</span>
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
            {/* Left Column - Order Information */}
            <div className="w-full">
              {/* Order Information Section Header */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">📄</span>
                  Order Information
                </h2>
              </div>

              {/* Order Information Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form className="space-y-4">
                  {/* Ship Start Date */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Ship Start Date</label>
                      <span className="text-xs text-gray-500">Start date for shipping</span>
                    </div>
                    <input
                      type="date"
                      value={formData.shipStartDate}
                      onChange={(e) => handleInputChange('shipStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Ship End Date */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Ship End Date</label>
                      <span className="text-xs text-gray-500">End date for shipping</span>
                    </div>
                    <input
                      type="date"
                      value={formData.shipEndDate}
                      onChange={(e) => handleInputChange('shipEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Client ID */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ClientID <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Client identifier</span>
                    </div>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      onBlur={() => handleBlur('clientId')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.clientId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="MAGM - MAGM LLC">MAGM - MAGM LLC</option>
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
                      <span className="text-xs text-gray-500">Distribution center</span>
                    </div>
                    <select
                      value={formData.dc}
                      onChange={(e) => handleInputChange('dc', e.target.value)}
                      onBlur={() => handleBlur('dc')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dc ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select DC</option>
                      <option value="Fort Lauderdale, Florida">Fort Lauderdale, Florida</option>
                      <option value="Bronx, NY">Bronx, NY</option>
                    </select>
                    {errors.dc && (
                      <p className="text-red-600 text-xs mt-1">{errors.dc}</p>
                    )}
                  </div>

                  {/* Carriers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Carriers <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Shipping carrier</span>
                    </div>
                    <select
                      value={formData.carriers}
                      onChange={(e) => handleInputChange('carriers', e.target.value)}
                      disabled={!formData.clientId || !formData.dc}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.clientId || !formData.dc
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {!formData.clientId || !formData.dc
                          ? 'Please select ClientID and DC first'
                          : 'Select Carrier'
                        }
                      </option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="DHL">DHL</option>
                    </select>
                  </div>

                  {/* Ship Method */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Ship Method <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Shipping method</span>
                    </div>
                    <select
                      value={formData.shipMethod}
                      onChange={(e) => handleInputChange('shipMethod', e.target.value)}
                      disabled={!formData.carriers}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.carriers
                          ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="">
                        {!formData.carriers
                          ? 'Please select Carrier first'
                          : 'Select Ship Method'
                        }
                      </option>
                      <option value="Ground">Ground</option>
                      <option value="Express">Express</option>
                      <option value="Overnight">Overnight</option>
                    </select>
                  </div>

                  {/* Rush Order */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">RushOrder</label>
                      <span className="text-xs text-gray-500">Rush order indicator</span>
                    </div>
                    <select
                      value={formData.rushOrder}
                      onChange={(e) => handleInputChange('rushOrder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* Order Number */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        OrderNum <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Order number</span>
                    </div>
                    <input
                      type="text"
                      value={formData.orderNum}
                      onChange={(e) => handleInputChange('orderNum', e.target.value)}
                      onBlur={() => handleBlur('orderNum')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.orderNum ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter order number"
                    />
                    {errors.orderNum && (
                      <p className="text-red-600 text-xs mt-1">{errors.orderNum}</p>
                    )}
                  </div>

                  {/* Customer PO Number */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Cust PO Num</label>
                      <span className="text-xs text-gray-500">Customer PO number</span>
                    </div>
                    <input
                      type="text"
                      value={formData.custPONum}
                      onChange={(e) => handleInputChange('custPONum', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter customer PO number"
                    />
                  </div>

                  {/* Pack Slip Comment */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">PackSlipComment</label>
                      <span className="text-xs text-gray-500">Packing slip comment</span>
                    </div>
                    <input
                      type="text"
                      value={formData.packSlipComment}
                      onChange={(e) => handleInputChange('packSlipComment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter pack slip comment"
                    />
                  </div>

                  {/* Packing Instructions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Packing Ins</label>
                      <span className="text-xs text-gray-500">Packing instructions</span>
                    </div>
                    <input
                      type="text"
                      value={formData.packingIns}
                      onChange={(e) => handleInputChange('packingIns', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter packing instructions"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Middle Column - Ship to Details */}
            <div className="w-full">
              {/* Ship to Details Section Header */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">📦</span>
                  Ship to Details
                </h2>
              </div>

              {/* Ship to Details Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form className="space-y-4">
                  {/* Location */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <span className="text-xs text-gray-500">Shipping location</span>
                    </div>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter a Location"
                    />
                  </div>

                  {/* Ship To Name 1 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ShipToName1 <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Primary recipient name</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToName1}
                      onChange={(e) => handleInputChange('shipToName1', e.target.value)}
                      onBlur={() => handleBlur('shipToName1')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.shipToName1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter primary recipient name"
                    />
                    {errors.shipToName1 && (
                      <p className="text-red-600 text-xs mt-1">{errors.shipToName1}</p>
                    )}
                  </div>

                  {/* Ship To Name 2 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">ShipToName2</label>
                      <span className="text-xs text-gray-500">Secondary recipient name</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToName2}
                      onChange={(e) => handleInputChange('shipToName2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter secondary recipient name"
                    />
                  </div>

                  {/* Ship To Address 1 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ShipToAddress1 <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Primary address line</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToAddress1}
                      onChange={(e) => handleInputChange('shipToAddress1', e.target.value)}
                      onBlur={() => handleBlur('shipToAddress1')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.shipToAddress1 ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter primary address"
                    />
                    {errors.shipToAddress1 && (
                      <p className="text-red-600 text-xs mt-1">{errors.shipToAddress1}</p>
                    )}
                  </div>

                  {/* Ship To Address 2 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">ShipToAddress2</label>
                      <span className="text-xs text-gray-500">Secondary address line</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToAddress2}
                      onChange={(e) => handleInputChange('shipToAddress2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter secondary address"
                    />
                  </div>

                  {/* Ship To Country */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">ShipToCountry</label>
                      <span className="text-xs text-gray-500">Shipping country</span>
                    </div>
                    <select
                      value={formData.shipToCountry}
                      onChange={(e) => handleInputChange('shipToCountry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                    </select>
                  </div>

                  {/* Ship To City */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ShipToCity <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Shipping city</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToCity}
                      onChange={(e) => handleInputChange('shipToCity', e.target.value)}
                      onBlur={() => handleBlur('shipToCity')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.shipToCity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter shipping city"
                    />
                    {errors.shipToCity && (
                      <p className="text-red-600 text-xs mt-1">{errors.shipToCity}</p>
                    )}
                  </div>

                  {/* Ship To State/Province */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ShipToStateOrProvince <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Shipping state/province</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToStateOrProvince}
                      onChange={(e) => handleInputChange('shipToStateOrProvince', e.target.value)}
                      onBlur={() => handleBlur('shipToStateOrProvince')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.shipToStateOrProvince ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter shipping state/province"
                    />
                    {errors.shipToStateOrProvince && (
                      <p className="text-red-600 text-xs mt-1">{errors.shipToStateOrProvince}</p>
                    )}
                  </div>

                  {/* Ship To Zip/Postal Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        ShipToZipOrPostalCode <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-500">Shipping postal code</span>
                    </div>
                    <input
                      type="text"
                      value={formData.shipToZipOrPostalCode}
                      onChange={(e) => handleInputChange('shipToZipOrPostalCode', e.target.value)}
                      onBlur={() => handleBlur('shipToZipOrPostalCode')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.shipToZipOrPostalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter shipping postal code"
                    />
                    {errors.shipToZipOrPostalCode && (
                      <p className="text-red-600 text-xs mt-1">{errors.shipToZipOrPostalCode}</p>
                    )}
                  </div>

                  {/* Ship To Email */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">ShipToEmail</label>
                      <span className="text-xs text-gray-500">Shipping email</span>
                    </div>
                    <input
                      type="email"
                      value={formData.shipToEmail}
                      onChange={(e) => handleInputChange('shipToEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter shipping email"
                    />
                  </div>

                  {/* Ship To Tel */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">ShipToTel</label>
                      <span className="text-xs text-gray-500">Shipping telephone</span>
                    </div>
                    <input
                      type="tel"
                      value={formData.shipToTel}
                      onChange={(e) => handleInputChange('shipToTel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter shipping telephone"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Bill to Details */}
            <div className="w-full">
              {/* Bill to Details Section Header */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">💳</span>
                  Bill to Details
                </h2>
              </div>
              
              {/* Bill to Details Form Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form className="space-y-4">
                  {/* Bill To Type */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Bill To Type</label>
                      <span className="text-xs text-gray-500">Billing type selection</span>
                    </div>
                    <select
                      value={formData.billToType}
                      onChange={(e) => handleInputChange('billToType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Bill To Type</option>
                      <option value="Prepaid">Prepaid</option>
                      <option value="Collect">Collect</option>
                      <option value="Third Party">Third Party</option>
                    </select>
                  </div>

                  {/* Order COD */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Order COD</label>
                      <span className="text-xs text-gray-500">Cash on delivery type</span>
                    </div>
                    <select
                      value={formData.orderCOD}
                      onChange={(e) => handleInputChange('orderCOD', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select COD Type</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </form>
              </div>
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
              Create Sales Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateSalesOrderForm 