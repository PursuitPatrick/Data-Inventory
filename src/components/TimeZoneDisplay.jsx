import { useState, useEffect } from 'react'

const TimeZoneDisplay = () => {
  const [currentTimes, setCurrentTimes] = useState({})

  const timeZones = [
    { name: 'US East', zone: 'America/New_York', display: 'US East' },
    { name: 'US West', zone: 'America/Los_Angeles', display: 'US West' },
    { name: 'London', zone: 'Europe/London', display: 'London' },
    { name: 'Dubai', zone: 'Asia/Dubai', display: 'Dubai' },
    { name: 'Hong Kong', zone: 'Asia/Hong_Kong', display: 'Hong Kong' },
    { name: 'Sydney', zone: 'Australia/Sydney', display: 'Sydney' }
  ]

  const updateTimes = () => {
    const times = {}
    timeZones.forEach(({ name, zone }) => {
      times[name] = new Date().toLocaleTimeString('en-US', {
        timeZone: zone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      })
    })
    setCurrentTimes(times)
  }

  useEffect(() => {
    updateTimes() // Initial update
    const interval = setInterval(updateTimes, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Time Zones</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {timeZones.map(({ name, display }) => (
          <div
            key={name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-200 flex flex-col justify-center items-center min-h-[100px]"
          >
            <div className="text-base font-medium text-gray-600 mb-2">
              {display}
            </div>
            <div className="text-base font-bold text-gray-900">
              {currentTimes[name] || '--:--'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeZoneDisplay 