import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Admin from './components/Admin'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Cases from './components/Cases'
import Documents from './components/Documents'
import Profile from './components/Profile'

function App() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleLogin = (email) => {
    // Check if user is admin (simple check for demo)
    const adminEmails = ['admin@advocate.ai', 'admin@example.com']
    setUser({ email })
    setIsAdmin(adminEmails.includes(email.toLowerCase()))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAdmin(false)
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Show admin dashboard if user is admin
  if (isAdmin) {
    return <Admin user={user} onLogout={handleLogout} />
  }

  // Main app with routing for regular users
  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App