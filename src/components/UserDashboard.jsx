import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import lawLogo from '../assets/law-logo.png'
import { listCases, listDocuments } from '../services/api'

function UserDashboard({ user, onLogout }) {
  const [recentCases, setRecentCases] = useState([])
  const [quickStats, setQuickStats] = useState({
    activeCases: 0,
    completedCases: 0,
    pendingReviews: 0,
    documentsUploaded: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [cases, docs] = await Promise.all([
        listCases(100, 0),
        listDocuments(100, 0).catch(() => [])
      ])
      const casesList = Array.isArray(cases) ? cases : (cases?.cases || [])
      const docsList = Array.isArray(docs) ? docs : (docs?.documents || [])

      const mappedCases = casesList.slice(0, 3).map(c => ({
        id: c._id,
        title: (c.case_text || '').substring(0, 40) + (c.case_text?.length > 40 ? '...' : ''),
        status: 'Completed',
        date: c.created_at || c.timestamp ? new Date(c.created_at || c.timestamp).toISOString().split('T')[0] : 'N/A',
        priority: 'Medium'
      }))

      setRecentCases(mappedCases)
      setQuickStats({
        activeCases: casesList.length,
        completedCases: casesList.length,
        pendingReviews: 0,
        documentsUploaded: docsList.length
      })
    } catch {
      setRecentCases([])
      setQuickStats({ activeCases: 0, completedCases: 0, pendingReviews: 0, documentsUploaded: 0 })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={lawLogo} alt="Law Logo" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-white">Advocate AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.email}</span>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-300">Manage your legal matters and track progress</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Active Cases</p>
                    <p className="text-3xl font-bold text-white">{quickStats.activeCases}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Completed Cases</p>
                    <p className="text-3xl font-bold text-white">{quickStats.completedCases}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold text-white">{quickStats.pendingReviews}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">Documents</p>
                    <p className="text-3xl font-bold text-white">{quickStats.documentsUploaded}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Recent Cases</h3>
                    <Link to="/cases" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentCases.length > 0 ? recentCases.map((case_) => (
                      <div key={case_.id} className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{case_.title}</h4>
                          <p className="text-sm text-gray-300">{case_.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            case_.status === 'Completed' ? 'bg-green-900 text-green-300' :
                            case_.status === 'In Progress' ? 'bg-blue-900 text-blue-300' :
                            'bg-yellow-900 text-yellow-300'
                          }`}>
                            {case_.status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            case_.priority === 'High' ? 'bg-red-900 text-red-300' :
                            case_.priority === 'Medium' ? 'bg-orange-900 text-orange-300' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {case_.priority}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-400 text-center py-8">No cases yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Link to="/new-case" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New Case
                    </Link>
                    <Link to="/documents" className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Documents
                    </Link>
                    <Link to="/profile" className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
