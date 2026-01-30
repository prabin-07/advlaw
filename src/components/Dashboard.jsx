import { useState } from 'react'
import { Link } from 'react-router-dom'
import lawLogo from '../assets/law-logo.png'

function Dashboard({ user }) {
  const [count, setCount] = useState(0)
  const [recentActivity] = useState([
    { id: 1, action: 'New case created', time: '2 hours ago', type: 'case' },
    { id: 2, action: 'Document uploaded', time: '4 hours ago', type: 'document' },
    { id: 3, action: 'Profile updated', time: '1 day ago', type: 'profile' },
    { id: 4, action: 'Case closed', time: '2 days ago', type: 'case' }
  ])

  const [stats] = useState({
    totalCases: 12,
    activeCases: 8,
    documentsUploaded: 24,
    completedThisWeek: 3
  })

  const getActivityIcon = (type) => {
    switch (type) {
      case 'case':
        return (
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <img 
          src={lawLogo}
          alt="Law Logo" 
          className="h-16 w-16 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
        />
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.email?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-lg text-gray-300">
          Here's what's happening with your legal work today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-white">{stats.totalCases}</p>
            </div>
            <div className="bg-blue-900 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Active Cases</p>
              <p className="text-3xl font-bold text-white">{stats.activeCases}</p>
            </div>
            <div className="bg-green-900 rounded-full p-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Documents</p>
              <p className="text-3xl font-bold text-white">{stats.documentsUploaded}</p>
            </div>
            <div className="bg-purple-900 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Completed This Week</p>
              <p className="text-3xl font-bold text-white">{stats.completedThisWeek}</p>
            </div>
            <div className="bg-yellow-900 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/cases"
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors duration-200 flex flex-col items-center text-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">New Case</span>
                <span className="text-sm opacity-75">Create a new legal case</span>
              </Link>

              <Link 
                to="/documents"
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors duration-200 flex flex-col items-center text-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="font-medium">Upload Document</span>
                <span className="text-sm opacity-75">Add legal documents</span>
              </Link>

              <Link 
                to="/cases"
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors duration-200 flex flex-col items-center text-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">View Analytics</span>
                <span className="text-sm opacity-75">Case performance data</span>
              </Link>
            </div>
          </div>

          {/* Counter Example (Interactive Demo) */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Interactive Demo</h2>
            <div className="text-center">
              <p className="text-gray-300 mb-4">Test the interactive counter functionality</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button 
                  onClick={() => setCount(count - 1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-4xl font-bold text-white min-w-[4rem] bg-gray-700 py-2 px-4 rounded-lg">
                  {count}
                </span>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => setCount(0)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Reset Counter
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link 
                to="/cases"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard