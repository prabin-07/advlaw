import { useState } from 'react'
import lawLogo from '../assets/law-logo.png'

function Admin({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock data
  const stats = {
    totalUsers: 156,
    activeCases: 42,
    pendingRequests: 8,
    completedToday: 15
  }

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Client', status: 'Active', joinDate: '2025-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Advocate', status: 'Active', joinDate: '2025-01-12' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Client', status: 'Pending', joinDate: '2025-01-14' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Client', status: 'Active', joinDate: '2025-01-15' }
  ]

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Case submitted', user: 'Jane Smith', time: '4 hours ago' },
    { id: 3, action: 'Document uploaded', user: 'Mike Johnson', time: '5 hours ago' },
    { id: 4, action: 'Case closed', user: 'Sarah Williams', time: '1 day ago' }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={lawLogo} alt="Law Logo" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-white">Advocate AI - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Admin: {user.email}</span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              Activity
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-black-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-blue-900 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-black-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Active Cases</p>
                    <p className="text-3xl font-bold text-white">{stats.activeCases}</p>
                  </div>
                  <div className="bg-green-900 rounded-full p-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-black-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Pending Requests</p>
                    <p className="text-3xl font-bold text-white">{stats.pendingRequests}</p>
                  </div>
                  <div className="bg-yellow-900 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-black-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Completed Today</p>
                    <p className="text-3xl font-bold text-white">{stats.completedToday}</p>
                  </div>
                  <div className="bg-purple-900 rounded-full p-3">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black-800 rounded-lg shadow p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-black-600 border border-gray-700 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New User
                </button>
                <button className="bg-black-600 border border-gray-700 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create Case
                </button>
                <button className="bg-black-600 border border-gray-700 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-black rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-black">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">User Management</h2>
                <button className="bg-black-600 border border-gray-700 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Add User
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black border border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>  
                <tbody className="bg-black divide-y divide-gray-700">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-white textblackwhite' : 'bg-white text-black'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-black hover:text-white-700 mr-3">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-sm text-gray-300">by {activity.user}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin