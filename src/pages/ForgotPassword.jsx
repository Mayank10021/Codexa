import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { resetPassword } from '../services/firebase'
import { isFirebaseConfigured } from '../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const firebaseReady = isFirebaseConfigured()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      if (err.message.includes('user-not-found') || err.message.includes('invalid-email'))
        setError('No account found with this email address.')
      else if (err.message.includes('too-many-requests'))
        setError('Too many attempts. Please wait a few minutes.')
      else if (err.message === 'FIREBASE_NOT_CONFIGURED')
        setError('Firebase is not configured. Password reset is not available.')
      else
        setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-cx-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-up">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-cx-indigo rounded-lg flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-cx-text">Codexa</span>
        </div>

        {!sent ? (
          <>
            {/* Icon */}
            <div className="w-14 h-14 bg-cx-indigo-light border border-cx-indigo-mid rounded-2xl flex items-center justify-center mb-5">
              <Mail size={24} className="text-cx-indigo" />
            </div>

            <h1 className="font-display font-bold text-2xl text-cx-text mb-1">
              Forgot password?
            </h1>
            <p className="text-cx-muted text-sm font-body mb-7 leading-relaxed">
              No worries! Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-cx-rose-light border border-rose-200 rounded-xl flex items-start gap-2">
                  <AlertCircle size={14} className="text-cx-rose flex-shrink-0 mt-0.5" />
                  <p className="text-cx-rose text-xs font-body">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !firebaseReady}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                  : 'Send reset link'
                }
              </button>
            </form>
          </>
        ) : (
          /* ── Success screen ── */
          <div className="card text-center py-10 px-6">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={30} className="text-cx-emerald" />
            </div>
            <h2 className="font-display font-bold text-xl text-cx-text mb-2">
              Reset link sent!
            </h2>
            <p className="text-cx-muted text-sm font-body leading-relaxed mb-2">
              We sent a password reset link to
            </p>
            <p className="font-mono font-bold text-cx-indigo text-sm bg-cx-indigo-light px-4 py-2 rounded-xl inline-block mb-6">
              {email}
            </p>

            <div className="bg-cx-bg border border-cx-border rounded-xl p-4 text-left space-y-2 mb-6">
              {[
                'Open your email inbox',
                'Click the reset link',
                'Set your new password',
                'Come back and sign in',
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-cx-indigo text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-cx-sub text-xs font-body">{s}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="btn-secondary w-full mb-3 text-sm"
            >
              Try a different email
            </button>

            <p className="text-cx-faint text-xs font-body">
              Didn't receive it? Check your spam folder.
            </p>
          </div>
        )}

        {/* Back to login */}
        <Link
          to="/login"
          className="flex items-center gap-2 text-cx-muted hover:text-cx-indigo text-sm font-body font-medium transition-colors mt-6"
        >
          <ArrowLeft size={14} /> Back to Sign in
        </Link>
      </div>
    </div>
  )
}
