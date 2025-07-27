import { useState } from 'react'
import { FileText, Upload, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CreateProducts = () => {
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    console.log(`Selected: ${option}`)
    
    if (option === 'web-form') {
      navigate('/create-products/web-form')
    } else if (option === 'file-upload') {
      navigate('/create-products/file-upload')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Products</h1>
          <p className="text-gray-600">Choose how you'd like to create new product entries</p>
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

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Web Form Option */}
        <div 
          onClick={() => handleOptionSelect('web-form')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Web Form</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Manually enter product details through our intuitive web form. Perfect for creating individual products or small batches.
          </p>
          <div className="text-sm text-blue-600 font-medium">
            Create single product →
          </div>
        </div>

        {/* File Upload Option */}
        <div 
          onClick={() => handleOptionSelect('file-upload')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">File Upload</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Upload a spreadsheet or CSV file to create multiple products at once. Ideal for bulk product creation and data migration.
          </p>
          <div className="text-sm text-green-600 font-medium">
            Upload multiple products →
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-4 max-w-4xl">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Need help?</h4>
        <p className="text-sm text-gray-600">
          Download our <span className="text-blue-600 hover:underline cursor-pointer">product template</span> to see the required format for file uploads, 
          or check our <span className="text-blue-600 hover:underline cursor-pointer">documentation</span> for detailed instructions.
        </p>
      </div>
    </div>
  )
}

export default CreateProducts 