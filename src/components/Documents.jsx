import { useState } from 'react'

function Documents() {
  const [documents] = useState([
    { id: 1, name: 'Contract_Agreement.pdf', type: 'Contract', size: '2.4 MB', date: '2025-01-15', status: 'Processed' },
    { id: 2, name: 'Legal_Brief.docx', type: 'Brief', size: '1.8 MB', date: '2025-01-14', status: 'Processing' },
    { id: 3, name: 'Evidence_Photos.zip', type: 'Evidence', size: '15.2 MB', date: '2025-01-12', status: 'Processed' },
    { id: 4, name: 'Client_Statement.pdf', type: 'Statement', size: '0.9 MB', date: '2025-01-10', status: 'Processed' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-900 text-green-300'
      case 'Processing': return 'bg-yellow-900 text-yellow-300'
      case 'Failed': return 'bg-red-900 text-red-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'Contract':
        return (
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'Brief':
        return (
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'Evidence':
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Document Management</h1>
        <p className="text-gray-300">Upload, analyze, and manage your legal documents</p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Document
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Analyze Documents
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export All
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getFileIcon(doc.type)}
                <div className="ml-3">
                  <h3 className="text-white font-medium truncate">{doc.name}</h3>
                  <p className="text-gray-400 text-sm">{doc.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                {doc.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Size:</span>
                <span className="text-white">{doc.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{doc.date}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200">
                View
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm transition-colors duration-200">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div className="bg-gray-800 rounded-lg shadow border-2 border-dashed border-gray-600 p-12 text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 className="text-xl font-medium text-white mb-2">Drop files here to upload</h3>
        <p className="text-gray-400 mb-4">or click to browse your files</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Choose Files
        </button>
        <p className="text-gray-500 text-sm mt-2">Supports PDF, DOC, DOCX, TXT files up to 50MB</p>
      </div>
    </div>
  )
}

export default Documents