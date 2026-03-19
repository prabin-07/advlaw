import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { listCases } from '../../services/api'

function Cases() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCases()
    
    if (location.state?.message) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 5000)
    }
  }, [location.state])

  const fetchCases = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await listCases(100, 0)
      setCases(data)
      setFilteredCases(data)
    } catch (err) {
      setError(err.message || 'Failed to load cases')
      setCases([])
      setFilteredCases([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = cases.filter(case_ => 
        (case_.case_text || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCases(filtered)
    } else {
      setFilteredCases(cases)
    }
  }, [searchTerm, cases])

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString()
  }

  const handleCaseClick = (caseId) => {
    // Future: navigate to case detail page
    // navigate(`/cases/${caseId}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showMessage && location.state?.message && (
        <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-300">{location.state.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Cases</h1>
            <p className="text-gray-400 mt-2">
              View and manage your submitted legal case analyses
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
              variant="primary" 
              onClick={() => navigate('/new-case')}
            >
              + New Case
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-8">
        <Card.Content>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cases by content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading cases...</p>
          </Card.Content>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Cases</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button variant="primary" onClick={fetchCases}>
              Try Again
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Cases Grid */}
      {!isLoading && !error && filteredCases.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCases.map((case_) => (
            <Card 
              key={case_._id} 
              hover={true}
              className="cursor-pointer"
              onClick={() => handleCaseClick(case_._id)}
            >
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Card.Title className="text-lg mb-2">
                      {(case_.case_text || '').substring(0, 60)}{(case_.case_text || '').length > 60 ? '...' : ''}
                    </Card.Title>
                    <p className="text-gray-400 text-sm">
                      {(case_.case_text || '').substring(0, 150)}{(case_.case_text || '').length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-300 ml-4">
                    Completed
                  </span>
                </div>
              </Card.Header>

              <Card.Content className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(case_.created_at || case_.timestamp)}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" variant="primary" onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/cases/${case_._id}`)
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCases.length === 0 && (
        <Card className="text-center py-12">
          <Card.Content>
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No cases match your search' : 'No cases yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start by submitting your first legal case for analysis'
              }
            </p>
            {!searchTerm && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/new-case')}
              >
                Submit Your First Case
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Summary Stats */}
      {!isLoading && !error && cases.length > 0 && (
        <Card className="mt-8">
          <Card.Header>
            <Card.Title>Case Summary</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{cases.length}</div>
                <div className="text-sm text-gray-400">Total Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{cases.length}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatDate(cases[0]?.created_at || cases[0]?.timestamp)}
                </div>
                <div className="text-sm text-gray-400">Latest</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export default Cases