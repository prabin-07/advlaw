import { useState } from 'react'
import SearchBar from '../components/ui/SearchBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import lawLogo from '../assets/law-logo.png'

/**
 * UserDashboard - Main dashboard for regular users
 * Features prominent search bar for case analysis
 */
function UserDashboard({ user }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [recentCases] = useState([
    { id: 1, title: 'Contract Dispute Analysis', date: '2025-01-28', status: 'Completed' },
    { id: 2, title: 'Employment Law Query', date: '2025-01-27', status: 'In Progress' },
    { id: 3, title: 'Property Rights Case', date: '2025-01-26', status: 'Completed' }
  ])

  // Handle case analysis submission
  const handleCaseAnalysis = async (caseDetails) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)

    // Simulate AI analysis (replace with actual API call later)
    setTimeout(() => {
      setAnalysisResult({
        summary: 'Based on the provided details, this appears to be a contract law matter.',
        recommendations: [
          'Review the original contract terms carefully',
          'Gather all relevant correspondence',
          'Consider mediation before litigation'
        ],
        confidence: 85,
        caseType: 'Contract Law'
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-900 text-green-300'
      case 'In Progress': return 'bg-yellow-900 text-yellow-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <img 
            src={lawLogo}
            alt="Advocate AI Logo" 
            className="h-16 w-16 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h1>
          <p className="text-xl text-gray-300">
            Describe your legal case below for AI-powered analysis
          </p>
        </div>

        {/* Main Search Section */}
        <div className="mb-12">
          <Card className="max-w-5xl mx-auto" padding="p-8">
            <Card.Header className="text-center mb-8">
              <Card.Title className="text-2xl mb-2">Case Analysis</Card.Title>
              <p className="text-gray-400">
                Provide detailed information about your legal case for comprehensive AI analysis
              </p>
            </Card.Header>
            
            <SearchBar 
              onSubmit={handleCaseAnalysis}
              isLoading={isAnalyzing}
              placeholder="Describe your legal case in detail. Include relevant facts, parties involved, timeline, and specific legal concerns..."
            />
          </Card>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mb-12">
            <Card className="max-w-5xl mx-auto" padding="p-8">
              <Card.Header>
                <Card.Title className="flex items-center">
                  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Analysis Complete
                </Card.Title>
              </Card.Header>
              
              <Card.Content className="space-y-6">
                {/* Case Type & Confidence */}
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-400">Case Type:</span>
                    <p className="text-lg font-semibold text-white">{analysisResult.caseType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Confidence:</span>
                    <p className="text-lg font-semibold text-green-400">{analysisResult.confidence}%</p>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Summary</h4>
                  <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button variant="primary">
                    Save Analysis
                  </Button>
                  <Button variant="outline">
                    Get Detailed Report
                  </Button>
                  <Button variant="secondary" onClick={() => setAnalysisResult(null)}>
                    New Analysis
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        {/* Recent Cases & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Recent Case Analyses</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {recentCases.map((case_) => (
                    <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
                      <div>
                        <h4 className="font-medium text-white">{case_.title}</h4>
                        <p className="text-sm text-gray-400">{case_.date}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(case_.status)}`}>
                          {case_.status}
                        </span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <Button variant="primary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Upload Documents
                </Button>
                
                <Button variant="secondary" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Legal Resources
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Support
                </Button>
              </Card.Content>
            </Card>

            {/* Usage Stats */}
            <Card className="mt-6">
              <Card.Header>
                <Card.Title>Usage This Month</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Analyses</span>
                  <span className="text-white font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Documents</span>
                  <span className="text-white font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reports</span>
                  <span className="text-white font-semibold">5</span>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard