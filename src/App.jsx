import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import SettingsModal from './components/SettingsModal'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import Checker from './pages/Checker'
import Explainer from './pages/Explainer'
import Converter from './pages/Converter'
import Optimizer from './pages/Optimizer'
import Debugger from './pages/Debugger'
import Snippets from './pages/Snippets'
import GitHub from './pages/GitHub'
import ForgotPassword from './pages/ForgotPassword'
import { getUser, logout, persistUser, onAuthChange } from './services/authService'

const PUBLIC = ['/', '/login', '/register', '/forgot-password']

function AppContent({ user, setUser }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const loc = useLocation()
  const isAuthPage = loc.pathname === '/login' || loc.pathname === '/register' || loc.pathname === '/forgot-password'
  const isHome = loc.pathname === '/'
  const isPublic = PUBLIC.includes(loc.pathname)

  if (user && (loc.pathname === '/login' || loc.pathname === '/register')) return <Navigate to="/dashboard" replace />
  if (!user && !isPublic) return <Navigate to="/login" replace />

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  const handleLogin = (u) => {
    persistUser(u)
    setUser(u)
  }

  return (
    <div className="min-h-screen bg-cx-bg flex flex-col">
      {!isAuthPage && (
        <Navbar user={user} onSettingsClick={() => setSettingsOpen(true)} onLogout={handleLogout} />
      )}

      <div className={`flex flex-1 ${!isAuthPage ? 'pt-14' : ''}`}>
        {user && !isAuthPage && <Sidebar />}

        <main className={`flex-1 min-w-0 ${user && !isAuthPage ? 'md:ml-56' : ''}`}>
          {isAuthPage ? (
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          ) : (
            <div className={isPublic ? '' : 'p-5 max-w-6xl'}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/checker" element={<Checker />} />
                <Route path="/explainer" element={<Explainer />} />
                <Route path="/converter" element={<Converter />} />
                <Route path="/optimizer" element={<Optimizer />} />
                <Route path="/debugger" element={<Debugger />} />
                <Route path="/snippets" element={<Snippets />} />
                <Route path="/github" element={<GitHub />} />
              </Routes>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      {!isAuthPage && (
        <div className={user ? 'md:ml-56' : ''}>
          <Footer />
        </div>
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => getUser())
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsub = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        persistUser(firebaseUser)
        setUser(firebaseUser)
      }
      setAuthReady(true)
    })
    return unsub
  }, [])

  // Show nothing while Firebase initializes (prevents flash)
  if (!authReady && !user) {
    return (
      <div className="min-h-screen bg-cx-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cx-indigo-mid border-t-cx-indigo rounded-full animate-spin" />
          <p className="text-cx-faint text-sm font-body">Loading Codexa...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppContent user={user} setUser={setUser} />
    </BrowserRouter>
  )
}
