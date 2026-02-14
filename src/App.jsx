import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Layout from './components/Layout'

// User Pages
import Dashboard from './pages/user/Dashboard'
import NewCase from './pages/user/NewCase'
import Cases from './pages/user/Cases'
import Analytics from './pages/user/Analytics'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCases from './pages/admin/AdminCases'
import AdminAnalytics from './pages/admin/AdminAnalytics'

// Existing Components
import Documents from './components/Documents'
import Profile from './components/Profile'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Session management - restore session on app load
  useEffect(() => {
    const savedSession = localStorage.getItem('advocate_session')
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        const now = new Date().getTime()
        
        // Check if session is still valid (24 hours)
        if (session.expiresAt && now < session.expiresAt) {
          setUser(session.user)
          setIsAdmin(session.isAdmin)
        } else {
          // Session expired, clear it
          localStorage.removeItem('advocate_session')
        }
      } catch (error) {
        console.error('Error restoring session:', error)
        localStorage.removeItem('advocate_session')
      }
    }
  }, [])

  const handleLogin = (email) => {
    // Check if user is admin (simple check for demo)
    const adminEmails = ['admin@advocate.ai', 'admin@example.com']
    const userData = { email }
    const isUserAdmin = adminEmails.includes(email.toLowerCase())
    
    setUser(userData)
    setIsAdmin(isUserAdmin)

    // Save session to localStorage with 24-hour expiry
    const session = {
      user: userData,
      isAdmin: isUserAdmin,
      loginTime: new Date().getTime(),
      expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
    }
    localStorage.setItem('advocate_session', JSON.stringify(session))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('advocate_session')
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Show admin dashboard if user is admin
  if (isAdmin) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/cases" element={<AdminCases />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    )
  }

  // Main app with routing for regular users
  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/new-case" element={<NewCase />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          <Route path="/NewCase" element={<NewCase />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App