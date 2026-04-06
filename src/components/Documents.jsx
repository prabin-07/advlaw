import { useState, useRef, useEffect } from 'react'
import { listDocuments, createDocument, deleteDocument } from '../services/api'
import { analyzeCase } from '../services/api'

// ─── Analysis Result Modal ────────────────────────────────────────────────────

function AnalysisModal({ doc, onClose }) {
  const a = doc.analysis
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg truncate pr-4">{doc.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Content preview */}
          {doc.content && (
            <div>
              <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">Content Preview</h3>
              <p className="text-gray-300 text-sm bg-gray-900 rounded-lg p-3 whitespace-pre-wrap line-clamp-6">
                {doc.content.slice(0, 600)}{doc.content.length > 600 ? '…' : ''}
              </p>
            </div>
          )}
          {a ? (
            <>
              <Section title="Summary" content={a.summary} />
              <ListSection title="Legal Issues" items={a.legal_issues} color="red" />
              <ListSection title="Applicable Sections" items={a.applicable_sections} color="blue" />
              <ListSection title="Loopholes" items={a.loopholes} color="yellow" />
              <ListSection title="Recommended Actions" items={a.recommended_actions} color="green" />
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No analysis available. Use the Analyze button on the document card.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, content }) {
  if (!content) return null
  return (
    <div>
      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-gray-200 text-sm leading-relaxed">{content}</p>
    </div>
  )
}

function ListSection({ title, items, color }) {
  if (!items?.length) return null
  const colors = {
    red: 'bg-red-900/40 text-red-300',
    blue: 'bg-blue-900/40 text-blue-300',
    yellow: 'bg-yellow-900/40 text-yellow-300',
    green: 'bg-green-900/40 text-green-300',
  }
  return (
    <div>
      <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className={`text-sm px-3 py-1.5 rounded-md ${colors[color]}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Documents() {
  const [documents, setDocuments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyzingIds, setAnalyzingIds] = useState(new Set())
  const [viewDoc, setViewDoc] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchDocuments() }, [])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const docs = await listDocuments(100, 0)
      setDocuments(docs)
    } catch (err) {
      setError(err.message || 'Failed to load documents')
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  // ── Stats (live) ────────────────────────────────────────────────────────────

  const thisMonthCount = documents.filter(d => {
    if (!d.created_at) return false
    const created = new Date(d.created_at)
    const now = new Date()
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth()
  }).length

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-900 text-green-300'
      case 'Processing': return 'bg-yellow-900 text-yellow-300'
      case 'Failed': return 'bg-red-900 text-red-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getFileIcon = (type) => {
    const paths = {
      Contract: { color: 'text-blue-400', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      Brief:    { color: 'text-green-400', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      Evidence: { color: 'text-purple-400', d: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    }
    const p = paths[type] || { color: 'text-gray-400', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
    return (
      <svg className={`w-8 h-8 ${p.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.d} />
      </svg>
    )
  }

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    if (ext === 'pdf') return 'Contract'
    if (['doc', 'docx'].includes(ext)) return 'Brief'
    if (['jpg', 'jpeg', 'png', 'zip'].includes(ext)) return 'Evidence'
    return 'Statement'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files)
    await Promise.all(fileArray.map(async (file) => {
      const fileId = `${Date.now()}-${Math.random()}`
      const newDoc = {
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        status: 'Processing',
      }

      setDocuments(prev => [...prev, { ...newDoc, _id: fileId }])
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const cur = prev[fileId] || 0
          if (cur >= 90) { clearInterval(interval); return prev }
          return { ...prev, [fileId]: cur + 10 }
        })
      }, 200)

      try {
        // Read text content for analyzable file types
        let content = null
        if (['txt', 'doc', 'docx'].includes(file.name.split('.').pop().toLowerCase())) {
          content = await file.text().catch(() => null)
        }

        const createdDoc = await createDocument({ ...newDoc, content })
        setDocuments(prev => prev.map(d => d._id === fileId ? { ...createdDoc, status: 'Processed' } : d))
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
        setTimeout(() => setUploadProgress(prev => { const n = { ...prev }; delete n[fileId]; return n }), 1000)
      } catch (err) {
        setDocuments(prev => prev.map(d => d._id === fileId ? { ...d, status: 'Failed' } : d))
        clearInterval(interval)
        setUploadProgress(prev => { const n = { ...prev }; delete n[fileId]; return n })
      }
    }))
  }

  // ── Analyze ─────────────────────────────────────────────────────────────────

  const analyzeDoc = async (doc) => {
    const text = doc.content || doc.name
    if (!text || text.length < 20) {
      alert('Document has no analyzable content. Please upload a text-based file (TXT, DOC, DOCX).')
      return
    }
    setAnalyzingIds(prev => new Set(prev).add(doc._id))
    try {
      const result = await analyzeCase(text)
      setDocuments(prev => prev.map(d =>
        d._id === doc._id ? { ...d, analysis: result.analysis } : d
      ))
      // Open the result immediately
      setViewDoc(prev => prev?._id === doc._id ? { ...prev, analysis: result.analysis } : prev)
    } catch (err) {
      alert('Analysis failed: ' + (err.message || 'Unknown error'))
    } finally {
      setAnalyzingIds(prev => { const n = new Set(prev); n.delete(doc._id); return n })
    }
  }

  const analyzeAll = async () => {
    const analyzable = documents.filter(d => d.content && d.content.length >= 20 && !d.analysis)
    if (!analyzable.length) {
      alert('No documents with analyzable content found.')
      return
    }
    for (const doc of analyzable) {
      await analyzeDoc(doc)
    }
  }

  // ── Download / Export ───────────────────────────────────────────────────────

  const downloadDoc = (doc) => {
    const text = doc.content || `Document: ${doc.name}\nType: ${doc.type}\nSize: ${doc.size}\nDate: ${formatDate(doc.created_at)}`
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.name.replace(/\.[^.]+$/, '') + '.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAll = () => {
    const data = documents.map(d => ({
      name: d.name, type: d.type, size: d.size,
      status: d.status, created_at: d.created_at,
      content: d.content || null,
      analysis: d.analysis || null,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `documents-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(d => d._id !== id))
      setUploadProgress(prev => { const n = { ...prev }; delete n[id]; return n })
    } catch (err) {
      alert('Failed to delete document: ' + err.message)
    }
  }

  // ── Drag & Drop ─────────────────────────────────────────────────────────────

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files) }
  const handleFileSelect = (e) => { if (e.target.files.length > 0) handleFileUpload(e.target.files) }

  // ── Filter ──────────────────────────────────────────────────────────────────

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'All' || doc.type === typeFilter
    return matchesSearch && matchesType
  })

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Document Management</h1>
        <p className="text-gray-300">Upload, analyze, and manage your legal documents</p>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading documents...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300">{error}</span>
          </div>
          <button onClick={fetchDocuments} className="ml-4 text-sm text-red-300 underline hover:text-white shrink-0">Retry</button>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Search & Filter */}
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Contract">Contract</option>
              <option value="Brief">Brief</option>
              <option value="Evidence">Evidence</option>
              <option value="Statement">Statement</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Document
            </button>
            <button
              onClick={analyzeAll}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Analyze All
            </button>
            <button
              onClick={exportAll}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
            className="hidden"
          />

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>{searchTerm || typeFilter !== 'All' ? 'No documents match your filters.' : 'No documents yet. Upload one to get started.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredDocuments.map((doc) => (
                <div key={doc._id} className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 hover:border-gray-600 transition-colors flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center min-w-0">
                      {getFileIcon(doc.type)}
                      <div className="ml-3 min-w-0">
                        <h3 className="text-white font-medium truncate">{doc.name}</h3>
                        <p className="text-gray-400 text-sm">{doc.type}</p>
                      </div>
                    </div>
                    <span className={`ml-2 shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>

                  {uploadProgress[doc._id] !== undefined && uploadProgress[doc._id] < 100 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress[doc._id]}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress[doc._id]}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white">{doc.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{formatDate(doc.created_at)}</span>
                    </div>
                    {doc.analysis && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Issues found:</span>
                        <span className="text-green-400">{doc.analysis.legal_issues?.length ?? 0}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-auto">
                    <button
                      onClick={() => setViewDoc(doc)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => downloadDoc(doc)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => analyzeDoc(doc)}
                      disabled={analyzingIds.has(doc._id)}
                      className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      {analyzingIds.has(doc._id) ? '…' : 'Analyze'}
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drop Zone */}
          <div
            className={`bg-gray-800 rounded-lg shadow border-2 border-dashed p-12 text-center transition-colors ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">{isDragging ? 'Drop files here' : 'Drop files here to upload'}</h3>
            <p className="text-gray-400 mb-4">or click to browse your files</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Choose Files
            </button>
            <p className="text-gray-500 text-sm mt-2">Supports PDF, DOC, DOCX, TXT, JPG, PNG, ZIP files up to 50MB</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: 'Total Documents', value: documents.length, bg: 'bg-blue-900', icon: 'text-blue-400', path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { label: 'Processed', value: documents.filter(d => d.status === 'Processed').length, bg: 'bg-green-900', icon: 'text-green-400', path: 'M5 13l4 4L19 7' },
              { label: 'Processing', value: documents.filter(d => d.status === 'Processing').length, bg: 'bg-yellow-900', icon: 'text-yellow-400', path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'This Month', value: thisMonthCount, bg: 'bg-purple-900', icon: 'text-purple-400', path: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
            ].map(({ label, value, bg, icon, path }) => (
              <div key={label} className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                  </div>
                  <div className={`${bg} rounded-full p-3`}>
                    <svg className={`w-6 h-6 ${icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View / Analysis Modal */}
      {viewDoc && <AnalysisModal doc={viewDoc} onClose={() => setViewDoc(null)} />}
    </div>
  )
}

export default Documents
