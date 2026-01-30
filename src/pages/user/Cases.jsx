import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

/**
 * Cases - Page displaying all user's submitted cases
 * Shows case history with filtering and search capabilities
 */
function Cases() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showMessage, setShowMessage] = useState(false)

  // Mock cases data
  const mockCases = [
    {
      id: 1,
      title: 'Contract Dispute with ABC Company',
      description: 'Web development contract breach - late delivery and non-compliance with specifications',
      caseType: 'Contract Law',
      status: 'Completed',
      confidence: 85,
      createdDate: '2025-01-28',
      lastUpdated: '2025-01-28'
    },
    {
      id: 2,
      title: 'Employment Termination Issue',
      description: 'Wrongful termination claim - dismissed without proper notice period',
      caseType: 'Employment Law',
      status: 'In Progress',
      confidence: 78,
      createdDate: '2025-01-27',
      lastUpdated: '2025-01-28'
    },
    {
      id: 3,
      title: 'Property Boundary Dispute',
      description: 'Neighbor encroachment on property line - fence placement issue',
      caseType: 'Property Law',
      status: 'Completed',
      confidence: 92,
      createdDate: '2025-01-26',
      lastUpdated: '2025-01-27'
    },
    {
      id: 4,
      title: 'Intellectual Property Infringement',
      description: 'Trademark violation by competitor - unauthorized use of brand elements',
      caseType: 'IP Law',
      status: 'Pending Review',
      confidence: 67,
      createdDate: '2025-01-25',
      lastUpdated: '2025-01-26'
    }
  ]

  useEffect(() => {
    // Initialize cases (in real app, fetch from API)
    setCases(mockCases)
    setFilteredCases(mockCases)

    // Show success message if navigated from NewCase
    if (location.state?.message) {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 5000)
    }
  }, [location.state])

  // Filter cases based on search and status
  useEffect(() => {
    let filtered = cases

    if (searchTerm) {
      filtered = filtered.filter(case_ => 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.caseType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(case_ => case_.status === statusFilter)
    }

    setFilteredCases(filtered)
  }, [searchTerm, statusFilter, cases])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-900 text-green-300'
      case 'In Progress': return 'bg-blue-900 text-blue-300'
      case 'Pending Review': return 'bg-yellow-900 text-yellow-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const handleCaseClick = (caseId) => {
    // Navigate to case details (mock for now)
    console.log('Viewing case:', caseId)
    // In real app: navigate(`/cases/${caseId}`)
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
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cases by title, description, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Cases Grid */}
      {filteredCases.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCases.map((case_) => (
            <Card 
              key={case_.id} 
              hover={true}
              className="cursor-pointer"
              onClick={() => handleCaseClick(case_.id)}
            >
              <Card.Header>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Card.Title className="text-lg mb-2">{case_.title}</Card.Title>
                    <p className="text-gray-400 text-sm">{case_.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)} ml-4`}>
                    {case_.status}
                  </span>
                </div>
              </Card.Header>

              <Card.Content className="space-y-4">
                {/* Case Details */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-1">{case_.caseType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>
                      <span className={`ml-1 font-semibold ${getConfidenceColor(case_.confidence)}`}>
                        {case_.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {case_.createdDate}</span>
                  <span>Updated: {case_.lastUpdated}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCaseClick(case_.id)
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/analytics', { state: { caseId: case_.id } })
                    }}
                  >
                    Analytics
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <Card.Content>
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No cases match your search' : 'No cases yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search terms or filters'
                : 'Start by submitting your first legal case for analysis'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
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
      {cases.length > 0 && (
        <Card className="mt-8">
          <Card.Header>
            <Card.Title>Case Summary</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{cases.length}</div>
                <div className="text-sm text-gray-400">Total Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {cases.filter(c => c.status === 'Completed').length}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {cases.filter(c => c.status === 'In Progress').length}
                </div>
                <div className="text-sm text-gray-400">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {Math.round(cases.reduce((acc, c) => acc + c.confidence, 0) / cases.length)}%
                </div>
                <div className="text-sm text-gray-400">Avg Confidence</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

export default Cases