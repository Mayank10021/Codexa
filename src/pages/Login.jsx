import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, Mail, RefreshCw, Check } from 'lucide-react'
import { login, loginWithGoogle, isFirebaseConfigured } from '../services/authService'
import { resendVerificationEmail } from '../services/firebase'
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
  if (!msg) return 'Something went wrong. Please try again.'
  if (msg === 'FIREBASE_NOT_CONFIGURED') return null
  if (msg === 'EMAIL_NOT_VERIFIED') return 'EMAIL_NOT_VERIFIED'
  if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential'))
    return 'Incorrect email or password.'
  if (msg.includes('too-many-requests'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  if (msg.includes('popup-closed'))
    return 'Login popup was closed. Please try again.'
  if (msg.includes('popup-blocked'))
    return 'Browser blocked the popup. Please allow popups for this site.'
  if (msg.includes('account-exists-with-different-credential'))
    return 'An account with this email already exists using a different login method.'
  if (msg.includes('network-request-failed'))
    return 'Network error. Please check your internet connection.'
  return msg
}

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
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
    handleAuth(() => login(form.email, form.password), 'email')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-cx-indigo flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
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
            Code smarter,<br/>ship faster.
          </h2>
          <p className="text-indigo-200 font-body text-base leading-relaxed mb-8">
            AI-powered tools for every developer. Generate, debug, explain and optimize code instantly.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['7 AI tools', 'Live preview', 'Auto bug-fix', 'Free to use'].map(p => (
              <div key={p} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                <span className="text-white text-xs font-body">{p}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative space-y-3">
          {[
            { name: 'Rahul M.', text: 'Auto-fix saved my project deadline.' },
            { name: 'Priya S.', text: 'Best code explainer I\'ve used.' },
          ].map(t => (
            <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-white text-sm font-body">"{t.text}"</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div>
                <span className="text-indigo-200 text-xs font-semibold">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-cx-bg">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-cx-indigo rounded-lg flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-cx-text">Codexa</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-cx-text mb-1">Welcome back</h1>
          <p className="text-cx-muted text-sm font-body mb-6">
            No account?{' '}
            <Link to="/register" className="text-cx-indigo font-semibold hover:underline">Sign up free</Link>
          </p>

          {/* Firebase setup banner — only when not configured */}
          {!firebaseReady && <FirebaseSetupBanner />}

          {/* Social buttons — only shown when Firebase is ready */}
          {firebaseReady && (
            <div className="space-y-3 mb-6">
              <button onClick={() => handleAuth(loginWithGoogle, 'google')} disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-cx-border rounded-xl py-3 text-sm font-semibold text-cx-sub font-body hover:border-cx-border2 hover:shadow-card transition-all disabled:opacity-60 shadow-soft">
                {loading === 'google'
                  ? <div className="w-4 h-4 border-2 border-gray-300 border-t-cx-indigo rounded-full animate-spin" />
                  : <GoogleIcon />}
                Continue with Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cx-border" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-cx-bg px-3 text-xs text-cx-faint font-body">or with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-cx-sub font-body">Password</label>
                <Link to="/forgot-password" className="text-xs text-cx-indigo hover:underline font-body font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint hover:text-cx-muted transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && error !== 'EMAIL_NOT_VERIFIED' && (
              <div className="p-3 bg-cx-rose-light border border-rose-200 rounded-xl flex items-start gap-2">
                <AlertCircle size={14} className="text-cx-rose flex-shrink-0 mt-0.5" />
                <p className="text-cx-rose text-xs font-body leading-relaxed">{error}</p>
              </div>
            )}
            {error === 'EMAIL_NOT_VERIFIED' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-start gap-2">
                  <Mail size={15} className="text-cx-amber flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-xs font-semibold font-body">Email not verified yet</p>
                    <p className="text-amber-600 text-xs font-body mt-0.5">Please check your inbox and click the verification link before signing in.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!form.email || !form.password) return
                    try { await resendVerificationEmail(form.email, form.password); setError('RESENT') }
                    catch (e) { setError(e.message) }
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-body font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 py-2 rounded-lg transition-all">
                  <RefreshCw size={12} /> Resend verification email
                </button>
              </div>
            )}
            {error === 'RESENT' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                <Check size={14} className="text-cx-emerald flex-shrink-0" />
                <p className="text-cx-emerald text-xs font-body font-semibold">Verification email resent! Check your inbox.</p>
              </div>
            )}

            <button type="submit" disabled={!!loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
              {loading === 'email'
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                : <><span>Sign in with email</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-xs text-cx-faint text-center mt-6 font-body">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  )
}
