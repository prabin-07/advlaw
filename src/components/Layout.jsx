import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import lawLogo from '../assets/law-logo.png'

function Layout({ user, onLogout, children }) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'Cases', href: '/cases', icon: 'folder' },
    { name: 'Documents', href: '/documents', icon: 'document' },
    { name: 'Profile', href: '/profile', icon: 'user' }
  ]

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      folder: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      document: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
    return icons[iconName] || icons.home
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Top Navbar */}
<div className="fixed top-0 left-0 right-0 z-50 h-16 bg-black border-b border-gray-700">
  <div className="flex items-center h-full px-6">
    
    {/* Logo */}
    <div className="flex items-center">
      <img src={lawLogo} alt="Law Logo" className="h-8 w-8 mr-3" />
      <span className="text-xl font-bold text-white">Advocate AI</span>
    </div>

    {/* Navigation */}
    <nav className="ml-10">
      <ul className="flex items-center space-x-6">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              to={item.href}
              className={`flex items-center text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'text-blue-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {getIcon(item.icon)}
              <span className="ml-2">{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    {/* User Section */}
    <div className="ml-auto flex items-center space-x-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="ml-2 text-sm text-white truncate max-w-[150px]">
          {user?.email}
        </span>
      </div>

      <button
        onClick={onLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
      >
        Logout
      </button>
    </div>
  </div>
</div>


      {/* Main content */}
      <div className="flex-1 lg:ml-0 mt-16 flex flex-col">
        {/* Top bar */}
        <header className="bg-gray-900 shadow-sm border-b border-gray-700 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsNavbarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <img src={lawLogo} alt="Law Logo" className="h-8 w-8 mr-3" />
              <span className="text-xl font-bold text-white">Advocate AI</span>
            </div>
            <div className="w-6"></div> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Disclaimer banner */}
        <div className="flex items-center justify-center gap-2 bg-yellow-900/30 border-t border-yellow-700/50 px-4 py-2 text-yellow-300 text-xs">
          <svg className="w-4 h-4 shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p>This website does not replace a legal advisor. Consider contacting a legal advisor for further proceedings.</p>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isNavbarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsNavbarOpen(false)}
        ></div>
      )}  
    </div>
  )
}

export default Layout