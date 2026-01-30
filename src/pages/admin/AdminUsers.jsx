import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

/**
 * AdminUsers - User management page for administrators
 * Allows viewing, enabling/disabling, and managing user accounts
 */
function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      joinDate: '2025-01-15',
      lastLogin: '2025-01-28',
      casesCount: 12,
      role: 'User',
      subscription: 'Premium'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Active',
      joinDate: '2025-01-14',
      lastLogin: '2025-01-27',
      casesCount: 8,
      role: 'User',
      subscription: 'Basic'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'Disabled',
      joinDate: '2025-01-10',
      lastLogin: '2025-01-20',
      casesCount: 3,
      role: 'User',
      subscription: 'Basic'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      status: 'Active',
      joinDate: '2025-01-12',
      lastLogin: '2025-01-28',
      casesCount: 15,
      role: 'User',
      subscription: 'Premium'
    },
    {
      id: 5,
      name: 'Admin User',
      email: 'admin@advocate.ai',
      status: 'Active',
      joinDate: '2025-01-01',
      lastLogin: '2025-01-29',
      casesCount: 0,
      role: 'Admin',
      subscription: 'Admin'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState([])

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-300'
      case 'Disabled': return 'bg-red-900 text-red-300'
      case 'Pending': return 'bg-yellow-900 text-yellow-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-purple-900 text-purple-300'
      case 'User': return 'bg-blue-900 text-blue-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const handleUserToggle = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Disabled' : 'Active'
        }
      }
      return user
    }))
  }

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) return

    switch (action) {
      case 'enable':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Active' } : user
        ))
        break
      case 'disable':
        setUsers(users.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Disabled' } : user
        ))
        break
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          setUsers(users.filter(user => !selectedUsers.includes(user.id)))
        }
        break
    }
    setSelectedUsers([])
  }

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-2">
              Manage user accounts, permissions, and access controls
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              ← Admin Dashboard
            </Button>
            <Button variant="primary">
              + Add New User
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-8">
        <Card.Content>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
                <option value="Pending">Pending</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="User">Users</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="mb-6">
          <Card.Content>
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleBulkAction('enable')}
                >
                  Enable Selected
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('disable')}
                >
                  Disable Selected
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <Card.Content padding="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Cases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-300">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.casesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => console.log('View user:', user.id)}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant={user.status === 'Active' ? 'secondary' : 'primary'}
                        onClick={() => handleUserToggle(user.id)}
                      >
                        {user.status === 'Active' ? 'Disable' : 'Enable'}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {users.filter(u => u.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-400">Active Users</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {users.filter(u => u.role === 'User').length}
            </div>
            <div className="text-sm text-gray-400">Regular Users</div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {users.filter(u => u.role === 'Admin').length}
            </div>
            <div className="text-sm text-gray-400">Administrators</div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default AdminUsers