import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import lawLogo from '../assets/law-logo.png'
import { listCases, checkHealth } from '../services/api'

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalCases: 0,
    systemHealth: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [healthData, setHealthData] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [cases, health] = await Promise.all([
        listCases(100, 0),
        checkHealth()
      ])
      
      setStats({
        totalCases: cases.length,
        systemHealth: health.status === 'healthy' ? 98 : 50
      })
      setHealthData(health)
    } catch (err) {
      setStats({ totalCases: 0, systemHealth: 0 })
    } finally {
      setIsLoading(false)
    }
  }
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'chart' },
    { id: 'users', name: 'User Management', icon: 'users' },
    { id: 'cases', name: 'Case History', icon: 'folder' },
    { id: 'system', name: 'System', icon: 'cog' }
  ]

  const getTabIcon = (iconName) => {
    const icons = {
      chart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      users: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      folder: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      cog: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
    return icons[iconName] || icons.chart
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={lawLogo} alt="Law Logo" className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">Advocate AI - Admin Panel</h1>
                <p className="text-xs text-gray-400">System Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Admin: {user.email}</span>
              <Button variant="danger" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                {getTabIcon(tab.icon)}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {isLoading ? (
              <Card className="text-center py-12">
                <Card.Content>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading dashboard data...</p>
                </Card.Content>
              </Card>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <Card.Content className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Total Cases</p>
                        <p className="text-3xl font-bold text-white">{stats.totalCases}</p>
                      </div>
                      <div className="bg-purple-900 rounded-full p-3">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300 mb-1">System Health</p>
                        <p className="text-3xl font-bold text-white">{stats.systemHealth}%</p>
                      </div>
                      <div className="bg-yellow-900 rounded-full p-3">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </Card.Content>
                  </Card>

                  <Card>
                    <Card.Content className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300 mb-1">Database</p>
                        <p className="text-lg font-bold text-white">{healthData?.database || 'N/A'}</p>
                      </div>
                      <div className="bg-green-900 rounded-full p-3">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </Card.Content>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <Card.Header>
                    <Card.Title>Quick Actions</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="primary" className="justify-start" onClick={() => navigate('/admin/cases')}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Manage Cases
                      </Button>
                      <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/analytics')}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        System Analytics
                      </Button>
                    </div>
                  </Card.Content>
                </Card>

                {/* System Info */}
                {healthData && (
                  <Card>
                    <Card.Header>
                      <Card.Title>System Information</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-green-400 font-semibold">{healthData.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Database:</span>
                          <span className="text-white">{healthData.database}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cases Collection:</span>
                          <span className="text-white">{healthData.collections?.cases?.count || 0} documents</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Law Sections:</span>
                          <span className="text-white">{healthData.sections_available || 0} available</span>
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <Card>
            <Card.Header>
              <Card.Title>User Management</Card.Title>
            </Card.Header>
            <Card.Content className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
              <p className="text-gray-400 mb-4">
                User management requires backend API implementation
              </p>
              <Button variant="outline" onClick={() => navigate('/admin/users')}>
                View User Management Page
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Case History Tab */}
        {activeTab === 'cases' && (
          <Card>
            <Card.Header className="flex justify-between items-center">
              <Card.Title>Case History Management</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/cases')}>
                View All Cases
              </Button>
            </Card.Header>
            <Card.Content className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">
                View detailed case management on the dedicated cases page
              </p>
            </Card.Content>
          </Card>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>System Status</Card.Title>
              </Card.Header>
              <Card.Content>
                {healthData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-900 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-300">System is healthy and operational</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Backend Status</div>
                        <div className="text-lg font-semibold text-white capitalize">{healthData.status}</div>
                      </div>
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Database</div>
                        <div className="text-lg font-semibold text-white">{healthData.database}</div>
                      </div>
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Total Cases</div>
                        <div className="text-lg font-semibold text-white">{healthData.collections?.cases?.count || 0}</div>
                      </div>
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Law Sections</div>
                        <div className="text-lg font-semibold text-white">{healthData.sections_available || 0}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading system status...</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard