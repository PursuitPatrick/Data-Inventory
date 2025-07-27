import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Download } from 'lucide-react'

const CreateChildSerial = () => {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    console.log('File uploaded:', file.name)
  }

  const handleDownloadTemplate = () => {
    console.log('Download template triggered')
    // TODO: Implement actual template download
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create Child SKUs (Serial #)</h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload a file to create child SKUs with serial number data
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded shadow p-6 max-w-xl mx-auto space-y-4">
        {/* Upload File Section */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload File
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50 hover:file:bg-gray-100"
            />
            <Upload className="w-5 h-5 text-gray-400" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {selectedFile ? (
              <>Selected file: <span className="font-medium">{selectedFile.name}</span></>
            ) : (
              'No file chosen'
            )}
          </div>
        </div>

        {/* Download Template Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChildSerial 