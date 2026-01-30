import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import lawLogo from '../assets/law-logo.png'

/**
 * AdminDashboard - Comprehensive admin panel for managing users and cases
 * Maintains consistent design with user interface but with admin-specific features
 */
function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock data for admin dashboard
  const [stats] = useState({
    totalUsers: 156,
    activeUsers: 142,
    totalCases: 1247,
    pendingCases: 23,
    completedToday: 15,
    systemHealth: 98
  })

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', joinDate: '2025-01-15', casesCount: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', joinDate: '2025-01-14', casesCount: 8 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Disabled', joinDate: '2025-01-10', casesCount: 3 },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', joinDate: '2025-01-12', casesCount: 15 }
  ])

  const [cases] = useState([
    { id: 1, title: 'Contract Dispute Analysis', user: 'John Doe', date: '2025-01-28', status: 'Completed', type: 'Contract Law' },
    { id: 2, title: 'Employment Law Query', user: 'Jane Smith', date: '2025-01-28', status: 'Processing', type: 'Employment Law' },
    { id: 3, title: 'Property Rights Case', user: 'Mike Johnson', date: '2025-01-27', status: 'Completed', type: 'Property Law' },
    { id: 4, title: 'Intellectual Property', user: 'Sarah Williams', date: '2025-01-27', status: 'Pending', type: 'IP Law' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': case 'Completed': return 'bg-green-900 text-green-300'
      case 'Processing': case 'Pending': return 'bg-yellow-900 text-yellow-300'
      case 'Disabled': return 'bg-red-900 text-red-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const handleUserToggle = (userId) => {
    console.log('Toggle user status:', userId)
    // Implementation for user enable/disable
  }

  const handleCaseDelete = (caseId) => {
    console.log('Delete case:', caseId)
    // Implementation for case deletion
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <Card.Content className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
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
                    <p className="text-sm text-gray-300 mb-1">Active Users</p>
                    <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
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
            </div>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="primary" className="justify-start" onClick={() => navigate('/admin/users')}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Manage Users
                  </Button>
                  <Button variant="secondary" className="justify-start" onClick={() => navigate('/admin/cases')}>
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
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <Card>
            <Card.Header className="flex justify-between items-center">
              <Card.Title>User Management</Card.Title>
              <Button variant="primary">Add New User</Button>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cases</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.casesCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.joinDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleUserToggle(user.id)}>
                            {user.status === 'Active' ? 'Disable' : 'Enable'}
                          </Button>
                          <Button size="sm" variant="secondary">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Case History Tab */}
        {activeTab === 'cases' && (
          <Card>
            <Card.Header className="flex justify-between items-center">
              <Card.Title>Case History Management</Card.Title>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="secondary" size="sm">Filter</Button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Case Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {cases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{case_.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{case_.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{case_.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{case_.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="danger" onClick={() => handleCaseDelete(case_.id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>System Configuration</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">AI Analysis Settings</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">Configure AI Models</Button>
                      <Button variant="outline" className="w-full justify-start">Analysis Thresholds</Button>
                      <Button variant="outline" className="w-full justify-start">Response Templates</Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">System Maintenance</h4>
                    <div className="space-y-3">
                      <Button variant="secondary" className="w-full justify-start">Database Backup</Button>
                      <Button variant="secondary" className="w-full justify-start">Clear Cache</Button>
                      <Button variant="danger" className="w-full justify-start">System Restart</Button>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>System Logs</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-64 overflow-y-auto">
                  <div>[2025-01-29 10:30:15] INFO: System startup completed</div>
                  <div>[2025-01-29 10:31:22] INFO: User authentication successful - john@example.com</div>
                  <div>[2025-01-29 10:32:45] INFO: Case analysis completed - ID: 1247</div>
                  <div>[2025-01-29 10:33:12] WARN: High memory usage detected - 85%</div>
                  <div>[2025-01-29 10:34:01] INFO: Database backup completed</div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard