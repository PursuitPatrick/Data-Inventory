import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ArrowLeft } from 'lucide-react'

const CreateReturn = () => {
  const navigate = useNavigate()
  
  // Dropdown states
  const [returnOrdersOpen, setReturnOrdersOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    returnStartDate: '',
    returnEndDate: '',
    clientId: 'MAGM - MAGM LLC',
    dc: 'FLL - Fort Lauderdale, FL',
    carriers: '',
    returnMethod: '',
    priorityReturn: 'No',
    returnNum: '',
    custPONum: '',
    returnReason: '',
    returnInstructions: '',
    location: '',
    returnToName1: '',
    returnToName2: '',
    returnToAddress1: '',
    returnToAddress2: '',
    returnToCountry: 'United States',
    returnToCity: '',
    returnToStateOrProvince: '',
    returnToZipOrPostalCode: '',
    returnToEmail: '',
    returnToTel: '',
    billToType: '',
    returnCOD: ''
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Dropdown options
  const returnOrdersOptions = [
    { label: 'Manage Returns', path: '/returns' },
    { label: 'Create Return', path: '/returns/create' }
  ]

  const reportsOptions = [
    { label: 'Returns Log', path: '/returns/log' }
  ]

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
    if (['clientId', 'dc', 'returnNum', 'returnToName1', 'returnToAddress1', 'returnToCity', 'returnToStateOrProvince', 'returnToZipOrPostalCode'].includes(field)) {
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
    const requiredFields = ['clientId', 'dc', 'returnNum', 'returnToName1', 'returnToAddress1', 'returnToCity', 'returnToStateOrProvince', 'returnToZipOrPostalCode']
    
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
    const requiredFields = ['clientId', 'dc', 'returnNum', 'returnToName1', 'returnToAddress1', 'returnToCity', 'returnToStateOrProvince', 'returnToZipOrPostalCode']
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
    const requiredFields = ['clientId', 'dc', 'returnNum', 'returnToName1', 'returnToAddress1', 'returnToCity', 'returnToStateOrProvince', 'returnToZipOrPostalCode']
    return requiredFields.every(field => formData[field].trim() !== '')
  }

  const handleSave = () => {
    if (validateForm()) {
      console.log('Return Form data:', formData)
      // TODO: Add save logic for return
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="p-6">
      {/* Dropdowns Container */}
      <div className="mb-4 flex space-x-4">
        {/* Return Orders Dropdown */}
        <div className="relative">
          <button
            onClick={() => setReturnOrdersOpen(!returnOrdersOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Return Orders</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${returnOrdersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {returnOrdersOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {returnOrdersOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setReturnOrdersOpen(false)
                      if (option.label === 'Manage Returns') {
                        navigate(option.path)
                        // Trigger Expected tab on Manage Returns page
                        setTimeout(() => {
                          const expectedTab = document.querySelector('[data-tab="Expected"]')
                          if (expectedTab) {
                            expectedTab.click()
                          }
                        }, 100)
                      } else {
                        navigate(option.path)
                      }
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      option.label === 'Create Return' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reports Dropdown */}
        <div className="relative">
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span>Reports</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${reportsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {reportsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {reportsOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setReportsOpen(false)
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Left side - Title */}
          <div className="flex flex-col">
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Return</h1>
              <p className="text-sm text-gray-600">Manually enter return details to create a new return entry</p>
            </div>
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            {/* Caution Message */}
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm flex items-center space-x-2 mt-4 mb-6">
              <span>⚠️</span>
              <span>Please enter the information for the return you would like to create.</span>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Return Information */}
              <div className="w-full">
                {/* Select Client Section Header */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📄</span>
                    Select Client
                  </h2>
                </div>

                {/* Select Client Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <form className="space-y-4">
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
                        <option value="FLL - Fort Lauderdale, FL">FLL - Fort Lauderdale, FL</option>
                        <option value="BRX - Bronx, NY">BRX - Bronx, NY</option>
                        <option value="LAX - Los Angeles, CA">LAX - Los Angeles, CA</option>
                      </select>
                      {errors.dc && (
                        <p className="text-red-600 text-xs mt-1">{errors.dc}</p>
                      )}
                    </div>

                    {/* RMA # */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          RMA # <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-500">Return merchandise authorization</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnNum}
                        onChange={(e) => handleInputChange('returnNum', e.target.value)}
                        onBlur={() => handleBlur('returnNum')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.returnNum ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter RMA number"
                      />
                      {errors.returnNum && (
                        <p className="text-red-600 text-xs mt-1">{errors.returnNum}</p>
                      )}
                    </div>

                    {/* Customer PO Number */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Cust PO #</label>
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
                  </form>
                </div>
              </div>

              {/* Middle Column - Select Carrier */}
              <div className="w-full">
                {/* Select Carrier Section Header */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">📦</span>
                    Select Carrier
                  </h2>
                </div>

                {/* Select Carrier Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <form className="space-y-4">
                    {/* Carrier */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Carrier</label>
                        <span className="text-xs text-gray-500">Shipping carrier selection</span>
                      </div>
                      <select
                        value={formData.carriers}
                        onChange={(e) => handleInputChange('carriers', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Carrier</option>
                        <option value="UPS">UPS (United Parcel Service)</option>
                        <option value="USPS">USPS (US Postal Service)</option>
                        <option value="LTL">LTL (Less-Than-Truckload)</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>

                    {/* Scan Tracking Numbers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Scan Tracking Numbers</label>
                        <span className="text-xs text-gray-500">Barcode scan or manual entry</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnNum}
                        onChange={(e) => handleInputChange('returnNum', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Scan or enter tracking numbers"
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Capture Details */}
              <div className="w-full">
                {/* Capture Details Section Header */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">💳</span>
                    Capture Details
                  </h2>
                </div>
                
                {/* Capture Details Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <form className="space-y-4">
                    {/* Location */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Location</label>
                        <span className="text-xs text-gray-500">Capture location</span>
                      </div>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter a Location"
                      />
                    </div>

                    {/* Name1 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Name1</label>
                        <span className="text-xs text-gray-500">Primary name</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToName1}
                        onChange={(e) => handleInputChange('returnToName1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter primary name"
                      />
                    </div>

                    {/* Name2 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Name2</label>
                        <span className="text-xs text-gray-500">Secondary name</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToName2}
                        onChange={(e) => handleInputChange('returnToName2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter secondary name"
                      />
                    </div>

                    {/* Address1 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Address1</label>
                        <span className="text-xs text-gray-500">Primary address line</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToAddress1}
                        onChange={(e) => handleInputChange('returnToAddress1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter primary address"
                      />
                    </div>

                    {/* Address2 */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Address2</label>
                        <span className="text-xs text-gray-500">Secondary address line</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToAddress2}
                        onChange={(e) => handleInputChange('returnToAddress2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter secondary address"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <span className="text-xs text-gray-500">Capture country</span>
                      </div>
                      <select
                        value={formData.returnToCountry}
                        onChange={(e) => handleInputChange('returnToCountry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <span className="text-xs text-gray-500">Capture city</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToCity}
                        onChange={(e) => handleInputChange('returnToCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    {/* StateOrProvince */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">StateOrProvince</label>
                        <span className="text-xs text-gray-500">State or province</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToStateOrProvince}
                        onChange={(e) => handleInputChange('returnToStateOrProvince', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter state or province"
                      />
                    </div>

                    {/* ZipOrPostalCode */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">ZipOrPostalCode</label>
                        <span className="text-xs text-gray-500">Postal code</span>
                      </div>
                      <input
                        type="text"
                        value={formData.returnToZipOrPostalCode}
                        onChange={(e) => handleInputChange('returnToZipOrPostalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter postal code"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <span className="text-xs text-gray-500">Email address</span>
                      </div>
                      <input
                        type="email"
                        value={formData.returnToEmail}
                        onChange={(e) => handleInputChange('returnToEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Tel */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Tel</label>
                        <span className="text-xs text-gray-500">Telephone number</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.returnToTel}
                        onChange={(e) => handleInputChange('returnToTel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter telephone number"
                      />
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
                Create Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReturn 