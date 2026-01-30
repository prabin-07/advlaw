import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

/**
 * Analytics - User analytics dashboard showing case statistics and insights
 * Displays charts, trends, and performance metrics for user's cases
 */
function Analytics() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('cases')

  // Mock analytics data
  const [analyticsData] = useState({
    overview: {
      totalCases: 12,
      completedCases: 8,
      avgConfidence: 82,
      successRate: 75,
      totalSavings: 15000,
      avgResolutionTime: 14
    },
    casesByType: [
      { type: 'Contract Law', count: 5, percentage: 42 },
      { type: 'Employment Law', count: 3, percentage: 25 },
      { type: 'Property Law', count: 2, percentage: 17 },
      { type: 'IP Law', count: 2, percentage: 16 }
    ],
    monthlyTrends: [
      { month: 'Oct', cases: 2, confidence: 78 },
      { month: 'Nov', cases: 4, confidence: 81 },
      { month: 'Dec', cases: 3, confidence: 85 },
      { month: 'Jan', cases: 3, confidence: 82 }
    ],
    recentInsights: [
      {
        id: 1,
        type: 'success',
        title: 'High Success Rate',
        description: 'Your contract law cases have a 90% success rate',
        date: '2025-01-28'
      },
      {
        id: 2,
        type: 'improvement',
        title: 'Confidence Trending Up',
        description: 'Average case confidence increased by 8% this month',
        date: '2025-01-27'
      },
      {
        id: 3,
        type: 'tip',
        title: 'Documentation Tip',
        description: 'Cases with detailed documentation show 15% higher confidence',
        date: '2025-01-26'
      }
    ]
  })

  useEffect(() => {
    // If navigated from a specific case, could show case-specific analytics
    if (location.state?.caseId) {
      console.log('Showing analytics for case:', location.state.caseId)
    }
  }, [location.state])

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'improvement':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'tip':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      default:
        return null
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Focus:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cases">Case Volume</option>
                <option value="confidence">Confidence Scores</option>
                <option value="types">Case Types</option>
                <option value="success">Success Rates</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.totalCases}</p>
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
              <p className="text-sm text-gray-300 mb-1">Avg Confidence</p>
              <p className="text-3xl font-bold text-white">{analyticsData.overview.avgConfidence}%</p>
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
              <p className="text-3xl font-bold text-white">{analyticsData.overview.successRate}%</p>
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
              <p className="text-sm text-gray-300 mb-1">Est. Savings</p>
              <p className="text-3xl font-bold text-white">${analyticsData.overview.totalSavings.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-900 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Case Types Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Cases by Type</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {analyticsData.casesByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-white">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-400 text-sm w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <Card.Header>
            <Card.Title>Monthly Trends</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{month.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Cases</div>
                      <div className="text-white font-semibold">{month.cases}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Confidence</div>
                      <div className="text-green-400 font-semibold">{month.confidence}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Insights</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {analyticsData.recentInsights.map((insight) => (
              <div key={insight.id} className="flex items-start space-x-3 p-4 bg-gray-900 rounded-lg">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{insight.description}</p>
                  <span className="text-xs text-gray-500">{insight.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Chart Placeholder */}
      <Card className="mt-8">
        <Card.Header>
          <Card.Title>Performance Chart</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-400">Interactive charts coming soon</p>
              <p className="text-gray-500 text-sm mt-1">
                Detailed performance visualization will be available in the next update
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Analytics