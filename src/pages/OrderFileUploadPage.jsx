import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function OrderFileUploadPage() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Order file uploaded:", file.name);
    // Add processing logic later
  };

  const handleDownloadTemplate = () => {
    console.log("Download order template triggered");
    // Later: trigger download of a real template file
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Upload Order File</h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload a CSV or Excel file to add new orders to your system.
      </p>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4">
        {/* Upload Button */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select a file</label>
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50 hover:file:bg-gray-100"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}
        </div>

        {/* Download Template Button */}
        <button
          onClick={handleDownloadTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Template
        </button>
      </div>
    </div>
  );
} 