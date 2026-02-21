import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { listCases, deleteCase } from '../../services/api'

/**
 * Maps database case to admin UI format
 */
function mapCaseToAdminFormat(caseDoc) {
  const caseText = caseDoc.case_text || ''
  const createdAt = caseDoc.created_at || caseDoc.timestamp
  const createdDate = createdAt ? new Date(createdAt).toISOString().split('T')[0] : 'N/A'
  return {
    id: caseDoc._id,
    _id: caseDoc._id,
    title: caseText.substring(0, 60) + (caseText.length > 60 ? '...' : ''),
    description: caseText,
    case_text: caseText,
    user: 'System',
    userEmail: 'N/A',
    caseType: 'General',
    status: 'Completed',
    confidence: 85,
    priority: 'Medium',
    createdDate,
    lastUpdated: createdDate,
    created_at: createdAt,
  }
}

/**
 * AdminCases - Case management page for administrators
 * Fetches cases from database, allows viewing and deleting
 */
function AdminCases() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedCases, setSelectedCases] = useState([])
  const [sortBy, setSortBy] = useState('createdDate')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await listCases(100, 0)
      setCases(Array.isArray(data) ? data.map(mapCaseToAdminFormat) : (data.cases || []).map(mapCaseToAdminFormat))
    } catch (err) {
      setError(err.message || 'Failed to load cases')
      setCases([])
    } finally {
      setIsLoading(false)
    }
  }

  const caseTypes = [...new Set(cases.map(c => c.caseType))]

  const filteredCases = cases
    .filter(case_ => {
      const text = (case_.case_text || case_.description || '').toLowerCase()
      const title = (case_.title || '').toLowerCase()
      const user = (case_.user || '').toLowerCase()
      const matchesSearch = text.includes(searchTerm.toLowerCase()) ||
        title.includes(searchTerm.toLowerCase()) ||
        user.includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || case_.status === statusFilter
      const matchesType = typeFilter === 'all' || case_.caseType === typeFilter
      const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const modifier = sortOrder === 'asc' ? 1 : -1
      if (typeof aVal === 'string') return (aVal || '').localeCompare(bVal || '') * modifier
      return ((aVal || 0) - (bVal || 0)) * modifier
    })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-900 text-green-300'
      case 'In Progress': return 'bg-blue-900 text-blue-300'
      case 'Pending Review': return 'bg-yellow-900 text-yellow-300'
      case 'Under Review': return 'bg-purple-900 text-purple-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-900 text-red-300'
      case 'Medium': return 'bg-yellow-900 text-yellow-300'
      case 'Low': return 'bg-green-900 text-green-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const handleCaseDelete = async (caseId) => {
    if (!confirm('Are you sure you want to delete this case? This action cannot be undone.')) return
    try {
      await deleteCase(caseId)
      setCases(cases.filter(c => c.id !== caseId))
      setSelectedCases(selectedCases.filter(id => id !== caseId))
    } catch (err) {
      setError(err.message || 'Failed to delete case')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCases.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedCases.length} cases? This action cannot be undone.`)) return
    try {
      for (const id of selectedCases) {
        await deleteCase(id)
      }
      setCases(cases.filter(c => !selectedCases.includes(c.id)))
      setSelectedCases([])
    } catch (err) {
      setError(err.message || 'Failed to delete cases')
    }
  }

  const handleSelectCase = (caseId) => {
    setSelectedCases(prev =>
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]
    )
  }

  const handleSelectAll = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([])
    } else {
      setSelectedCases(filteredCases.map(c => c.id))
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const avgConfidence = cases.length > 0
    ? Math.round(cases.reduce((acc, c) => acc + (c.confidence || 0), 0) / cases.length)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Case Management</h1>
            <p className="text-gray-400 mt-2">
              Monitor and manage all user case submissions and AI analyses
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              ← Admin Dashboard
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin/analytics')}>
              View Analytics
            </Button>
            <Button variant="primary" onClick={fetchCases}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <Card className="text-center py-12">
          <Card.Content>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-400">Loading cases...</p>
          </Card.Content>
        </Card>
      )}

      {!isLoading && (
        <>
          {/* Search and Filter Controls */}
          <Card className="mb-8">
            <Card.Content>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search cases by title, user, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdDate">Date Created</option>
                    <option value="lastUpdated">Last Updated</option>
                    <option value="confidence">Confidence</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                  <Button size="sm" variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Under Review">Under Review</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </Card.Content>
          </Card>

          {/* Bulk Actions */}
          {selectedCases.length > 0 && (
            <Card className="mb-6">
              <Card.Content>
                <div className="flex items-center justify-between">
                  <span className="text-white">
                    {selectedCases.length} case{selectedCases.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="danger" onClick={handleBulkDelete}>
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Cases Table */}
          <Card>
            <Card.Content padding="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('title')}>
                        Case {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('user')}>
                        User {sortBy === 'user' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('confidence')}>
                        Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('createdDate')}>
                        Created {sortBy === 'createdDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredCases.map((case_) => (
                      <tr key={case_.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCases.includes(case_.id)}
                            onChange={() => handleSelectCase(case_.id)}
                            className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-white truncate">{case_.title}</div>
                            <div className="text-sm text-gray-400 truncate">{(case_.description || case_.case_text || '').substring(0, 80)}{(case_.description || case_.case_text || '').length > 80 ? '...' : ''}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{case_.user}</div>
                          <div className="text-sm text-gray-400">{case_.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{case_.caseType}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(case_.priority)}`}>
                            {case_.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${getConfidenceColor(case_.confidence)}`}>
                            {case_.confidence}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{case_.createdDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="danger" onClick={() => handleCaseDelete(case_.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCases.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    {cases.length === 0 ? 'No cases in database' : 'No cases match your filters'}
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
            <Card>
              <Card.Content className="text-center">
                <div className="text-2xl font-bold text-white">{cases.length}</div>
                <div className="text-sm text-gray-400">Total Cases</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center">
                <div className="text-2xl font-bold text-green-400">{cases.filter(c => c.status === 'Completed').length}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center">
                <div className="text-2xl font-bold text-blue-400">{cases.filter(c => c.status === 'In Progress').length}</div>
                <div className="text-sm text-gray-400">In Progress</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{avgConfidence}%</div>
                <div className="text-sm text-gray-400">Avg Confidence</div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center">
                <div className="text-2xl font-bold text-purple-400">{cases.filter(c => c.priority === 'High').length}</div>
                <div className="text-sm text-gray-400">High Priority</div>
              </Card.Content>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminCases
