import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

/**
 * AdminAnalytics - System-wide analytics dashboard for administrators
 * Displays comprehensive statistics, performance metrics, and system insights
 */
function AdminAnalytics() {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedView, setSelectedView] = useState('overview')

  // Mock comprehensive analytics data
  const [analyticsData] = useState({
    systemOverview: {
      totalUsers: 156,
      activeUsers: 142,
      totalCases: 1247,
      casesThisMonth: 89,
      avgResponseTime: 2.4,
      systemUptime: 99.8,
      aiAccuracy: 87.3,
      userSatisfaction: 4.6
    },
    userMetrics: {
      newUsersThisMonth: 23,
      userRetentionRate: 78,
      avgCasesPerUser: 8.2,
      mostActiveUsers: [
        { name: 'John Doe', cases: 15, lastActive: '2025-01-29' },
        { name: 'Sarah Williams', cases: 12, lastActive: '2025-01-28' },
        { name: 'Jane Smith', cases: 11, lastActive: '2025-01-29' }
      ]
    },
    caseAnalytics: {
      casesByType: [
        { type: 'Contract Law', count: 425, percentage: 34, avgConfidence: 85 },
        { type: 'Employment Law', count: 312, percentage: 25, avgConfidence: 82 },
        { type: 'Property Law', count: 249, percentage: 20, avgConfidence: 89 },
        { type: 'IP Law', count: 186, percentage: 15, avgConfidence: 78 },
        { type: 'Consumer Law', count: 75, percentage: 6, avgConfidence: 81 }
      ],
      monthlyTrends: [
        { month: 'Sep', cases: 98, users: 134, confidence: 84.2 },
        { month: 'Oct', cases: 112, users: 138, confidence: 85.1 },
        { month: 'Nov', cases: 105, users: 145, confidence: 86.8 },
        { month: 'Dec', cases: 89, users: 149, confidence: 87.3 },
        { month: 'Jan', cases: 89, users: 156, confidence: 87.3 }
      ],
      performanceMetrics: {
        avgAnalysisTime: 2.4,
        successRate: 94.2,
        userSatisfactionScore: 4.6,
        accuracyImprovement: 12.5
      }
    },
    systemHealth: {
      cpuUsage: 45,
      memoryUsage: 67,
      diskUsage: 34,
      networkLatency: 23,
      errorRate: 0.2,
      apiResponseTime: 180
    },
    recentAlerts: [
      {
        id: 1,
        type: 'warning',
        title: 'High Memory Usage',
        description: 'System memory usage exceeded 80% threshold',
        timestamp: '2025-01-29 10:30:00',
        resolved: false
      },
      {
        id: 2,
        type: 'info',
        title: 'New User Milestone',
        description: 'Reached 150+ active users this month',
        timestamp: '2025-01-28 15:45:00',
        resolved: true
      },
      {
        id: 3,
        type: 'success',
        title: 'AI Model Update',
        description: 'Successfully deployed improved analysis model v2.1',
        timestamp: '2025-01-27 09:15:00',
        resolved: true
      }
    ]
  })

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getHealthColor = (value, type = 'usage') => {
    if (type === 'usage') {
      if (value >= 80) return 'text-red-400'
      if (value >= 60) return 'text-yellow-400'
      return 'text-green-400'
    }
    // For response times, error rates, etc.
    if (value >= 500) return 'text-red-400'
    if (value >= 200) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">System Analytics</h1>
            <p className="text-gray-400 mt-2">
              Comprehensive system performance and usage analytics
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              ← Admin Dashboard
            </Button>
            <Button variant="secondary">
              Export Report
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
              <span className="text-gray-400 text-sm">View:</span>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">System Overview</option>
                <option value="users">User Analytics</option>
                <option value="cases">Case Analytics</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{analyticsData.systemOverview.totalUsers}</p>
              <p className="text-xs text-green-400">+{analyticsData.userMetrics.newUsersThisMonth} this month</p>
            </div>
            <div className="bg-blue-900 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-white">{analyticsData.systemOverview.totalCases}</p>
              <p className="text-xs text-green-400">+{analyticsData.systemOverview.casesThisMonth} this month</p>
            </div>
            <div className="bg-green-900 rounded-full p-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">AI Accuracy</p>
              <p className="text-3xl font-bold text-white">{analyticsData.systemOverview.aiAccuracy}%</p>
              <p className="text-xs text-green-400">+{analyticsData.caseAnalytics.performanceMetrics.accuracyImprovement}% improved</p>
            </div>
            <div className="bg-purple-900 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">System Uptime</p>
              <p className="text-3xl font-bold text-white">{analyticsData.systemOverview.systemUptime}%</p>
              <p className="text-xs text-green-400">Excellent</p>
            </div>
            <div className="bg-yellow-900 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Case Types Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Cases by Legal Type</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {analyticsData.caseAnalytics.casesByType.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{item.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{item.count} cases</span>
                      <span className="text-green-400 text-sm">{item.avgConfidence}% avg</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* System Health */}
        <Card>
          <Card.Header>
            <Card.Title>System Health</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-900 rounded-lg">
                <div className={`text-2xl font-bold ${getHealthColor(analyticsData.systemHealth.cpuUsage)}`}>
                  {analyticsData.systemHealth.cpuUsage}%
                </div>
                <div className="text-sm text-gray-400">CPU Usage</div>
              </div>
              <div className="text-center p-3 bg-gray-900 rounded-lg">
                <div className={`text-2xl font-bold ${getHealthColor(analyticsData.systemHealth.memoryUsage)}`}>
                  {analyticsData.systemHealth.memoryUsage}%
                </div>
                <div className="text-sm text-gray-400">Memory</div>
              </div>
              <div className="text-center p-3 bg-gray-900 rounded-lg">
                <div className={`text-2xl font-bold ${getHealthColor(analyticsData.systemHealth.diskUsage)}`}>
                  {analyticsData.systemHealth.diskUsage}%
                </div>
                <div className="text-sm text-gray-400">Disk Usage</div>
              </div>
              <div className="text-center p-3 bg-gray-900 rounded-lg">
                <div className={`text-2xl font-bold ${getHealthColor(analyticsData.systemHealth.apiResponseTime, 'response')}`}>
                  {analyticsData.systemHealth.apiResponseTime}ms
                </div>
                <div className="text-sm text-gray-400">API Response</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="mb-8">
        <Card.Header>
          <Card.Title>Monthly Performance Trends</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Month</th>
                  <th className="text-left py-2 text-gray-400">Cases</th>
                  <th className="text-left py-2 text-gray-400">Users</th>
                  <th className="text-left py-2 text-gray-400">Avg Confidence</th>
                  <th className="text-left py-2 text-gray-400">Growth</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.caseAnalytics.monthlyTrends.map((month, index) => {
                  const prevMonth = analyticsData.caseAnalytics.monthlyTrends[index - 1]
                  const growth = prevMonth ? ((month.cases - prevMonth.cases) / prevMonth.cases * 100).toFixed(1) : 0
                  
                  return (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3 text-white font-medium">{month.month}</td>
                      <td className="py-3 text-gray-300">{month.cases}</td>
                      <td className="py-3 text-gray-300">{month.users}</td>
                      <td className="py-3 text-green-400">{month.confidence}%</td>
                      <td className="py-3">
                        <span className={`text-sm ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {growth >= 0 ? '+' : ''}{growth}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <Card.Header>
          <Card.Title>Recent System Alerts</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {analyticsData.recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-4 bg-gray-900 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{alert.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      alert.resolved 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {alert.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="mt-8">
        <Card.Header>
          <Card.Title>Performance Dashboard</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-400">Advanced performance charts coming soon</p>
              <p className="text-gray-500 text-sm mt-1">
                Real-time system monitoring and detailed analytics visualization
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default AdminAnalytics