import { useState } from 'react'

function Cases() {
  const [cases] = useState([
    { id: 1, title: 'Contract Dispute', client: 'John Doe', status: 'Active', date: '2025-01-15', priority: 'High' },
    { id: 2, title: 'Employment Issue', client: 'Jane Smith', status: 'Pending', date: '2025-01-14', priority: 'Medium' },
    { id: 3, title: 'Property Rights', client: 'Mike Johnson', status: 'Closed', date: '2025-01-10', priority: 'Low' },
    { id: 4, title: 'Intellectual Property', client: 'Sarah Williams', status: 'Active', date: '2025-01-12', priority: 'High' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-300'
      case 'Pending': return 'bg-yellow-900 text-yellow-300'
      case 'Closed': return 'bg-gray-700 text-gray-300'
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

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Case Management</h1>
        <p className="text-gray-300">Manage and track all your legal cases</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          New Case
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Import Cases
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Export Report
        </button>
      </div>

      {/* Cases Table */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">All Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Case Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {cases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{caseItem.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{caseItem.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{caseItem.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-400 hover:text-blue-300 mr-3">View</button>
                    <button className="text-green-400 hover:text-green-300 mr-3">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-white">{cases.length}</p>
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
              <p className="text-3xl font-bold text-white">{cases.filter(c => c.status === 'Active').length}</p>
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
              <p className="text-sm text-gray-300 mb-1">Pending Cases</p>
              <p className="text-3xl font-bold text-white">{cases.filter(c => c.status === 'Pending').length}</p>
            </div>
            <div className="bg-yellow-900 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Closed Cases</p>
              <p className="text-3xl font-bold text-white">{cases.filter(c => c.status === 'Closed').length}</p>
            </div>
            <div className="bg-purple-900 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases