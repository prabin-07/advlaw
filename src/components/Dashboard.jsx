import { useState } from 'react'
import lawLogo from '../assets/law-logo.png'

function Dashboard({ user }) {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="mb-8">
        <img 
          src={lawLogo}
          alt="Law Logo" 
          className="h-24 w-24 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
        />
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Advocate AI
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Your AI-powered legal assistant is ready to help
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Case Management Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Case Management
          </h2> 
          <div className="space-y-3">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              New Case
            </button>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              View Cases
            </button>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Case Analytics
            </button>
          </div>
        </div>

        {/* Legal Tools Card */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Legal Tools
          </h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Document Analysis
            </button>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Legal Research
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Case Management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard