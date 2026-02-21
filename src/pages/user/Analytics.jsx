import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { listCases } from '../../services/api'

function Analytics() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [location.state])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const data = await listCases(100, 0)
      setCases(data)
    } catch (err) {
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Case Analytics</h1>
            <p className="text-gray-400 mt-2">
              Insights and statistics about your legal case submissions
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              ← Dashboard
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/cases')}
            >
              View Cases
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <Card.Content>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Time Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading analytics...</p>
          </Card.Content>
        </Card>
      )}

      {/* Overview Stats */}
      {!isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Content className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Total Cases</p>
                  <p className="text-3xl font-bold text-white">{cases.length}</p>
                </div>
                <div className="bg-blue-900 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">{cases.length}</p>
                </div>
                <div className="bg-green-900 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-white">100%</p>
                </div>
                <div className="bg-purple-900 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">AI Analyses</p>
                  <p className="text-3xl font-bold text-white">{cases.length}</p>
                </div>
                <div className="bg-yellow-900 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <Card.Header>
              <Card.Title>Analytics Overview</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400">Detailed analytics visualization</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Charts and insights based on your case history
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </>
      )}
    </div>
  )
}

export default Analytics