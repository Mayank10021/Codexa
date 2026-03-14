import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Settings, LogOut, ChevronDown, Sparkles, Menu, X } from 'lucide-react'
import { logout, getUser } from '../services/authService'
import { getInitials } from '../utils/helpers'

export default function Navbar({ onSettingsClick, user, onLogout }) {
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const loc = useLocation()

  const handleLogout = () => {
    logout(); onLogout(); navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-cx-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-cx-indigo rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles size={13} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-cx-text tracking-tight">Codexa</span>
            <span className="hidden sm:inline text-cx-faint text-xs font-body ml-2">by Mayank Aneja</span>
          </div>
        </Link>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <button onClick={onSettingsClick} className="btn-ghost flex items-center gap-2">
                <Settings size={15} /> Settings
              </button>
              <div className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-cx-bg border border-transparent hover:border-cx-border transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-cx-indigo flex items-center justify-center overflow-hidden">
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white text-xs font-bold">{getInitials(user.name)}</span>
                    }
                  </div>
                  <span className="text-sm font-medium text-cx-sub">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={13} className="text-cx-faint" />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl border border-cx-border shadow-lift py-1.5 animate-fade-in z-50">
                    <div className="px-4 py-2.5 border-b border-cx-border mb-1">
                      <p className="text-sm font-semibold text-cx-text">{user.name}</p>
                      <p className="text-xs text-cx-faint">{user.email}</p>
                    </div>
                    <button onClick={() => { setDropOpen(false); onSettingsClick() }}
                      className="w-full text-left px-4 py-2 text-sm text-cx-sub hover:bg-cx-bg flex items-center gap-2">
                      <Settings size={14} /> API Settings
                    </button>
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-cx-rose hover:bg-cx-rose-light flex items-center gap-2">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 rounded-lg hover:bg-cx-bg transition-colors"
          onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-cx-border bg-white px-4 py-3 space-y-1 animate-fade-in">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-cx-sub">Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); onSettingsClick() }} className="block py-2 text-sm text-cx-sub">Settings</button>
              <button onClick={handleLogout} className="block py-2 text-sm text-cx-rose">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-cx-sub">Sign in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-semibold text-cx-indigo">Get started free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
