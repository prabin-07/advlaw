import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import SummaryStats from '../../components/analytics/SummaryStats'
import ActivityChart from '../../components/analytics/ActivityChart'
import TopItemsList from '../../components/analytics/TopItemsList'
import RecentCasesList from '../../components/analytics/RecentCasesList'
import { listCases } from '../../services/api'
import {
  filterByPeriod,
  computeStats,
  buildActivityData,
  computeTopIssues,
  computeTopSections,
  getRecentCases,
} from '../../utils/analyticsUtils'

function Analytics() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const filteredCases = useMemo(() => filterByPeriod(cases, selectedPeriod), [cases, selectedPeriod])
  const stats = useMemo(() => computeStats(filteredCases), [filteredCases])
  const activityData = useMemo(() => buildActivityData(filteredCases, selectedPeriod), [filteredCases, selectedPeriod])
  const topIssues = useMemo(() => computeTopIssues(filteredCases), [filteredCases])
  const topSections = useMemo(() => computeTopSections(filteredCases), [filteredCases])
  const recentCases = useMemo(() => getRecentCases(filteredCases), [filteredCases])

  useEffect(() => {
    fetchAnalytics()
  }, [location.state])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await listCases(100, 0)
      setCases(data)
    } catch (err) {
      setError(err.message || 'Failed to load analytics data.')
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  const retry = () => fetchAnalytics()

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
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate('/cases')}>
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
                <option value="all">All time</option>
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

      {/* Error State */}
      {!isLoading && error && (
        <Card className="text-center py-12">
          <Card.Content>
            <p className="text-red-400 mb-4">{error}</p>
            <Button variant="primary" onClick={retry}>
              Retry
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && cases.length === 0 && (
        <Card className="text-center py-12">
          <Card.Content>
            <p className="text-gray-400 mb-4">No cases yet. Submit your first case to see analytics.</p>
            <Button variant="primary" onClick={() => navigate('/new-case')}>
              Submit a Case
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Analytics Content */}
      {!isLoading && !error && cases.length > 0 && (
        <>
          <SummaryStats stats={stats} />
          <div className="mb-8">
            <ActivityChart data={activityData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <TopItemsList title="Top Legal Issues" items={topIssues} />
            <TopItemsList title="Most Referenced Law Sections" items={topSections} />
          </div>
          <RecentCasesList cases={recentCases} />
        </>
      )}
    </div>
  )
}

export default Analytics
