import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CreateWorkOrders = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        {/* Left side - Title */}
        <div className="flex flex-col">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Work Orders</h1>
            <p className="text-sm text-gray-600">Create new work orders for processing</p>
          </div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors duration-200 mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="text-8xl">⚠️</div>
        <div className="text-3xl font-bold text-gray-800">Coming Soon!</div>
        <div className="text-lg text-gray-600 text-center max-w-md">
          The Create Work Orders functionality is currently under development.
        </div>
      </div>
    </div>
  )
}

export default CreateWorkOrders 