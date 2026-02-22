import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/ui/SearchBar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { analyzeCase } from '../../services/api'

/**
 * NewCase - Page for submitting new legal cases for analysis
 * Features the main case input form with AI analysis functionality
 */
function NewCase() {
  const navigate = useNavigate()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)

  // Handle case analysis submission
  const handleCaseAnalysis = async (caseDetails) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setError(null)

    try {
      const result = await analyzeCase(caseDetails)
      
      setAnalysisResult({
        caseId: result.case_id,
        summary: result.analysis.summary,
        applicable_sections: result.analysis.applicable_sections || [],
        legal_issues: result.analysis.legal_issues || [],
        loopholes: result.analysis.loopholes || [],
        recommended_actions: result.analysis.recommended_actions || [],
        retrieved_sections: result.retrieved_sections,
        timestamp: result.timestamp
      })
    } catch (err) {
      setError(err.message || 'Failed to analyze case. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveCase = () => {
    navigate('/cases', { 
      state: { 
        message: 'Case analysis saved successfully!',
        newCase: analysisResult 
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">New Case Analysis</h1>
            <p className="text-gray-400 mt-2">
              Describe your legal case for AI-powered analysis and recommendations
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Case Input Section */}
      <div className="mb-12">
        <Card className="max-w-5xl mx-auto" padding="p-8">
          <Card.Header className="text-center mb-8">
            <Card.Title className="text-2xl mb-2">Case Details</Card.Title>
            <p className="text-gray-400">
              Provide comprehensive information about your legal case
            </p>
          </Card.Header>
          
          <SearchBar 
            onSubmit={handleCaseAnalysis}
            isLoading={isAnalyzing}
            placeholder="Describe your legal case in detail. Include:
• Parties involved and their relationship
• Timeline of events
• Specific legal concerns or disputes
• Relevant documents or evidence
• Desired outcome or resolution

Example: 'I signed a contract with ABC Company on January 1st for web development services. They delivered the project 3 months late and it doesn't meet the specifications outlined in our agreement. The contract includes a penalty clause for late delivery, but they're refusing to honor it...'"
            buttonText="Analyze Case"
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300">{error}</span>
              </div>
            </div>
          )}
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
              {/* Summary */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Summary</h4>
                <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
              </div>

              {/* Applicable Sections */}
              {analysisResult.applicable_sections && analysisResult.applicable_sections.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Applicable Legal Sections</h4>
                  <ul className="space-y-2">
                    {analysisResult.applicable_sections.map((section, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">
                          {typeof section === 'object' ? `${section.section || section.title}${section.description ? `: ${section.description}` : ''}` : section}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal Issues */}
              {analysisResult.legal_issues && analysisResult.legal_issues.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Legal Issues</h4>
                  <ul className="space-y-2">
                    {analysisResult.legal_issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-300">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Loopholes */}
              {analysisResult.loopholes && analysisResult.loopholes.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Potential Loopholes</h4>
                  <ul className="space-y-2">
                    {analysisResult.loopholes.map((loophole, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">{loophole}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions */}
              {analysisResult.recommended_actions && analysisResult.recommended_actions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Recommended Actions</h4>
                  <ul className="space-y-2">
                    {analysisResult.recommended_actions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button variant="primary" onClick={handleSaveCase}>
                  Save Case Analysis
                </Button>
                <Button variant="outline" onClick={() => navigate('/analytics')}>
                  View Analytics
                </Button>
                <Button variant="secondary" onClick={() => setAnalysisResult(null)}>
                  New Analysis
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card className="max-w-5xl mx-auto">
        <Card.Header>
          <Card.Title>Tips for Better Analysis</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Be Specific</h4>
              <p className="text-gray-300 text-sm">
                Include dates, names, amounts, and specific details about your situation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Include Context</h4>
              <p className="text-gray-300 text-sm">
                Explain the background and relationships between parties involved.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Mention Documents</h4>
              <p className="text-gray-300 text-sm">
                Reference any contracts, emails, or other relevant documentation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">State Your Goals</h4>
              <p className="text-gray-300 text-sm">
                Clearly describe what outcome or resolution you're seeking.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default NewCase