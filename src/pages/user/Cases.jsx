import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { listCases, deleteCase } from '../../services/api'

// ─── Case Detail Modal ────────────────────────────────────────────────────────

function CaseDetailModal({ case_, onClose, onDelete }) {
  const a = case_.analysis

  const chips = (items, color) => {
    const colors = {
      red: 'bg-red-900/40 text-red-300',
      blue: 'bg-blue-900/40 text-blue-300',
      yellow: 'bg-yellow-900/40 text-yellow-300',
      green: 'bg-green-900/40 text-green-300',
    }
    if (!items?.length) return <p className="text-gray-500 text-sm">None identified</p>
    return (
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`text-sm px-3 py-1.5 rounded-md ${colors[color]}`}>{item}</li>
        ))}
      </ul>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-white font-semibold text-lg">Case Details</h2>
            <p className="text-gray-400 text-xs mt-0.5">
              {case_.created_at ? new Date(case_.created_at).toLocaleString() : 'N/A'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Case Text */}
          <div>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Case Description</h3>
            <p className="text-gray-200 text-sm leading-relaxed bg-gray-900 rounded-lg p-3 whitespace-pre-wrap">
              {case_.case_text}
            </p>
          </div>

          {a ? (
            <>
              {a.summary && (
                <div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Summary</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{a.summary}</p>
                </div>
              )}
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Legal Issues</h3>
                {chips(a.legal_issues, 'red')}
              </div>
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Applicable Sections</h3>
                {chips(a.applicable_sections, 'blue')}
              </div>
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Loopholes</h3>
                {chips(a.loopholes, 'yellow')}
              </div>
              <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Recommended Actions</h3>
                {chips(a.recommended_actions, 'green')}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No analysis available for this case.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700">
          <Button variant="danger" size="sm" onClick={() => onDelete(case_._id)}>
            Delete Case
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Cases() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cases, setCases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [showMessage, setShowMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCase, setSelectedCase] = useState(null)

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
    } catch (err) {
      setError(err.message || 'Failed to load cases')
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return
    try {
      await deleteCase(id)
      setCases(prev => prev.filter(c => c._id !== id))
      setSelectedCase(null)
    } catch (err) {
      alert('Failed to delete case: ' + err.message)
    }
  }

  // Derived status: a case is "Completed" if it has a non-empty analysis object
  const caseStatus = (case_) => {
    const a = case_.analysis
    if (a && typeof a === 'object' && Object.keys(a).length > 0) return 'Completed'
    return 'Pending'
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleDateString()
  }

  // Filtered + sorted — derived, no extra state
  const displayedCases = useMemo(() => {
    let result = cases
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(c => (c.case_text || '').toLowerCase().includes(q))
    }
    return [...result].sort((a, b) => {
      const ta = new Date(a.created_at || 0).getTime()
      const tb = new Date(b.created_at || 0).getTime()
      return sortOrder === 'newest' ? tb - ta : ta - tb
    })
  }, [cases, searchTerm, sortOrder])

  // Live summary stats
  const completedCount = useMemo(() => cases.filter(c => caseStatus(c) === 'Completed').length, [cases])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showMessage && location.state?.message && (
        <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 text-green-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-300">{location.state.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Cases</h1>
            <p className="text-gray-400 mt-2">View and manage your submitted legal case analyses</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>← Dashboard</Button>
            <Button variant="primary" onClick={() => navigate('/new-case')}>+ New Case</Button>
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <Card className="mb-8">
        <Card.Content>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search cases by content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Loading */}
      {isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading cases...</p>
          </Card.Content>
        </Card>
      )}

      {/* Error */}
      {error && !isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Cases</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button variant="primary" onClick={fetchCases}>Try Again</Button>
          </Card.Content>
        </Card>
      )}

      {/* Cases Grid */}
      {!isLoading && !error && displayedCases.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedCases.map((case_) => {
            const a = case_.analysis
            const status = caseStatus(case_)
            const issueCount = a?.legal_issues?.length ?? 0
            const sectionCount = a?.applicable_sections?.length ?? 0
            const loopholeCount = a?.loopholes?.length ?? 0

            return (
              <Card
                key={case_._id}
                hover={true}
                className="cursor-pointer"
                onClick={() => setSelectedCase(case_)}
              >
                <Card.Header>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <Card.Title className="text-base mb-1 truncate">
                        {(case_.case_text || '').substring(0, 60)}{(case_.case_text || '').length > 60 ? '…' : ''}
                      </Card.Title>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {(case_.case_text || '').substring(0, 150)}{(case_.case_text || '').length > 150 ? '…' : ''}
                      </p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'Completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {status}
                    </span>
                  </div>
                </Card.Header>

                <Card.Content className="space-y-3">
                  {/* Analysis preview chips */}
                  {status === 'Completed' && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-900/40 text-red-300">
                        {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-900/40 text-blue-300">
                        {sectionCount} {sectionCount === 1 ? 'section' : 'sections'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-900/40 text-yellow-300">
                        {loopholeCount} {loopholeCount === 1 ? 'loophole' : 'loopholes'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(case_.created_at || case_.timestamp)}
                    </span>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="primary" onClick={() => setSelectedCase(case_)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(case_._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && displayedCases.length === 0 && (
        <Card className="text-center py-12">
          <Card.Content>
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No cases match your search' : 'No cases yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by submitting your first legal case for analysis'}
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={() => navigate('/new-case')}>
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
                <div className="text-2xl font-bold text-green-400">{completedCount}</div>
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

      {/* Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          case_={selectedCase}
          onClose={() => setSelectedCase(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default Cases
