import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

/**
 * AdminCases - Case management page for administrators
 * Allows viewing, managing, and deleting all user cases
 */
function AdminCases() {
  const navigate = useNavigate()
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'Contract Dispute with ABC Company',
      user: 'John Doe',
      userEmail: 'john@example.com',
      description: 'Web development contract breach - late delivery and non-compliance',
      caseType: 'Contract Law',
      status: 'Completed',
      confidence: 85,
      priority: 'Medium',
      createdDate: '2025-01-28',
      lastUpdated: '2025-01-28',
      aiAnalysisTime: '2.3s'
    },
    {
      id: 2,
      title: 'Employment Termination Issue',
      user: 'Jane Smith',
      userEmail: 'jane@example.com',
      description: 'Wrongful termination claim - dismissed without proper notice',
      caseType: 'Employment Law',
      status: 'In Progress',
      confidence: 78,
      priority: 'High',
      createdDate: '2025-01-27',
      lastUpdated: '2025-01-28',
      aiAnalysisTime: '1.8s'
    },
    {
      id: 3,
      title: 'Property Boundary Dispute',
      user: 'Mike Johnson',
      userEmail: 'mike@example.com',
      description: 'Neighbor encroachment on property line - fence placement',
      caseType: 'Property Law',
      status: 'Completed',
      confidence: 92,
      priority: 'Low',
      createdDate: '2025-01-26',
      lastUpdated: '2025-01-27',
      aiAnalysisTime: '3.1s'
    },
    {
      id: 4,
      title: 'Intellectual Property Infringement',
      user: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      description: 'Trademark violation by competitor - brand elements',
      caseType: 'IP Law',
      status: 'Pending Review',
      confidence: 67,
      priority: 'High',
      createdDate: '2025-01-25',
      lastUpdated: '2025-01-26',
      aiAnalysisTime: '4.2s'
    },
    {
      id: 5,
      title: 'Consumer Rights Violation',
      user: 'John Doe',
      userEmail: 'john@example.com',
      description: 'Defective product warranty claim denial',
      caseType: 'Consumer Law',
      status: 'Under Review',
      confidence: 73,
      priority: 'Medium',
      createdDate: '2025-01-24',
      lastUpdated: '2025-01-25',
      aiAnalysisTime: '2.7s'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedCases, setSelectedCases] = useState([])
  const [sortBy, setSortBy] = useState('createdDate')
  const [sortOrder, setSortOrder] = useState('desc')

  // Get unique case types for filter
  const caseTypes = [...new Set(cases.map(c => c.caseType))]

  // Filter and sort cases
  const filteredCases = cases
    .filter(case_ => {
      const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           case_.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || case_.status === statusFilter
      const matchesType = typeFilter === 'all' || case_.caseType === typeFilter
      const matchesPriority = priorityFilter === 'all' || case_.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      const modifier = sortOrder === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      return (aVal - bVal) * modifier
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

  const handleCaseDelete = (caseId) => {
    if (confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      setCases(cases.filter(c => c.id !== caseId))
      setSelectedCases(selectedCases.filter(id => id !== caseId))
    }
  }

  const handleBulkDelete = () => {
    if (selectedCases.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedCases.length} cases? This action cannot be undone.`)) {
      setCases(cases.filter(c => !selectedCases.includes(c.id)))
      setSelectedCases([])
    }
  }

  const handleSelectCase = (caseId) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
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
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              ← Admin Dashboard
            </Button>
            <Button 
              variant="secondary"
              onClick={() => navigate('/admin/analytics')}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-8">
        <Card.Content>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search cases by title, user, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Sort */}
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
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Filters */}
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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => console.log('Export selected cases')}
                >
                  Export Selected
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={handleBulkDelete}
                >
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('title')}
                  >
                    Case {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('user')}
                  >
                    User {sortBy === 'user' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('confidence')}
                  >
                    Confidence {sortBy === 'confidence' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort('createdDate')}
                  >
                    Created {sortBy === 'createdDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
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
                        <div className="text-sm text-gray-400 truncate">{case_.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{case_.user}</div>
                      <div className="text-sm text-gray-400">{case_.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {case_.caseType}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {case_.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => console.log('View case:', case_.id)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleCaseDelete(case_.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div className="text-2xl font-bold text-green-400">
              {cases.filter(c => c.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {cases.filter(c => c.status === 'In Progress').length}
            </div>
            <div className="text-sm text-gray-400">In Progress</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(cases.reduce((acc, c) => acc + c.confidence, 0) / cases.length)}%
            </div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {cases.filter(c => c.priority === 'High').length}
            </div>
            <div className="text-sm text-gray-400">High Priority</div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default AdminCases