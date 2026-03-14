import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Check, ArrowRight, AlertCircle } from 'lucide-react'
import { register, loginWithGoogle, isFirebaseConfigured } from '../services/authService'
import FirebaseSetupBanner from '../components/FirebaseSetupBanner'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
  </svg>
)

function friendlyError(msg) {
  if (!msg) return 'Something went wrong.'
  if (msg === 'FIREBASE_NOT_CONFIGURED') return null
  if (msg.includes('email-already-in-use') || msg.includes('already registered'))
    return 'This email is already registered. Try signing in instead.'
  if (msg.includes('weak-password')) return 'Password is too weak. Use at least 6 characters.'
  if (msg.includes('invalid-email')) return 'Please enter a valid email address.'
  if (msg.includes('popup-closed')) return 'Login popup was closed. Please try again.'
  if (msg.includes('popup-blocked')) return 'Browser blocked the popup. Please allow popups for this site.'
  if (msg.includes('network-request-failed')) return 'Network error. Check your internet connection.'
  return msg
}

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate()
  const firebaseReady = isFirebaseConfigured()

  const handleAuth = async (fn, type) => {
    setError(''); setLoading(type)
    try {
      const user = await fn()
      onLogin(user); navigate('/dashboard')
    } catch (err) {
      const friendly = friendlyError(err.message)
      if (friendly) setError(friendly)
    } finally { setLoading(null) }
  }

  const handleEmail = (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    handleAuth(() => register(form.name, form.email, form.password), 'email')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-cx-indigo via-indigo-600 to-violet-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-300/20 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-xl">Codexa</span>
              <span className="text-indigo-300 text-xs ml-2 font-body">by Mayank Aneja</span>
            </div>
          </div>
          <h2 className="font-display font-extrabold text-4xl text-white leading-tight mb-4">
            Your AI coding<br/>co-pilot.
          </h2>
          <div className="space-y-2.5 mt-6">
            {['Generate code from plain English', 'Auto-fix bugs with one click', 'Live preview for HTML/CSS/JS/React', 'Convert between 20+ languages', 'Save code snippets forever'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </div>
                <span className="text-indigo-100 text-sm font-body">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FCD34D"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <p className="text-white text-sm font-body leading-relaxed">"Codexa is my daily driver. The auto-fix alone saved my project deadline."</p>
          <p className="text-indigo-300 text-xs mt-2 font-semibold">Aryan K. · Backend Engineer</p>
        </div>
      </div>

      {/* Right — register form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-cx-bg">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-cx-indigo rounded-lg flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-cx-text">Codexa</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-cx-text mb-1">Create your account</h1>
          <p className="text-cx-muted text-sm font-body mb-6">
            Already have one?{' '}
            <Link to="/login" className="text-cx-indigo font-semibold hover:underline">Sign in</Link>
          </p>

          {!firebaseReady && <FirebaseSetupBanner />}

          {firebaseReady && (
            <div className="space-y-3 mb-6">
              <button onClick={() => handleAuth(loginWithGoogle, 'google')} disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-cx-border rounded-xl py-3 text-sm font-semibold text-cx-sub font-body hover:border-cx-border2 hover:shadow-card transition-all disabled:opacity-60 shadow-soft">
                {loading === 'google' ? <div className="w-4 h-4 border-2 border-gray-300 border-t-cx-indigo rounded-full animate-spin" /> : <GoogleIcon />}
                Sign up with Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cx-border" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-cx-bg px-3 text-xs text-cx-faint font-body">or sign up with email</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Full name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                className="input-field" placeholder="Name" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  className="input-field pr-10" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint hover:text-cx-muted">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-cx-rose-light border border-rose-200 rounded-xl flex items-start gap-2">
                <AlertCircle size={14} className="text-cx-rose flex-shrink-0 mt-0.5" />
                <p className="text-cx-rose text-xs font-body leading-relaxed">{error}</p>
              </div>
            )}

            <button type="submit" disabled={!!loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
              {loading === 'email'
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...</>
                : <><span>Create account</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-xs text-cx-faint text-center mt-5 font-body">
            By signing up, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
