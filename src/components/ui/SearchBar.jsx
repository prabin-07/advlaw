import { useState } from 'react'

/**
 * SearchBar Component - Reusable search/input component for case analysis
 * Supports multi-line text input with loading states
 */
function SearchBar({ 
  onSubmit, 
  placeholder = "Describe your legal case details...", 
  isLoading = false,
  buttonText = "Analyze Case"
}) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue.trim())
    }
  }

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main textarea input */}
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          
          {/* Character count */}
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {inputValue.length} characters
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="hidden sm:inline">Press Ctrl+Enter to submit quickly</span>
          </div>
          
          <div className="flex space-x-3">
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                disabled={isLoading}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            )}
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>{buttonText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar