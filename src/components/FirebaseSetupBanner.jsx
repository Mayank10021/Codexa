import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Copy, Check, Flame } from 'lucide-react'

const steps = [
  {
    num: 1,
    title: 'Create Firebase Project',
    desc: 'Go to Firebase Console and create a new project',
    link: 'https://console.firebase.google.com',
    linkText: 'Open Firebase Console →',
  },
  {
    num: 2,
    title: 'Enable Google & GitHub Auth',
    desc: 'Build → Authentication → Sign-in method → Enable Google ✅ and GitHub ✅',
    link: null,
  },
  {
    num: 3,
    title: 'Create Firestore Database',
    desc: 'Build → Firestore Database → Create → Start in test mode',
    link: null,
  },
  {
    num: 4,
    title: 'Get Config Keys',
    desc: 'Project Settings ⚙️ → Your apps → Web app → Copy the config object',
    link: null,
  },
  {
    num: 5,
    title: 'Add to .env file',
    desc: 'Paste your keys into the .env file in your project folder',
    link: null,
    code: true,
  },
]

const ENV_TEMPLATE = `VITE_FIREBASE_API_KEY=AIzaSy_PASTE_YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc`

export default function FirebaseSetupBanner() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(ENV_TEMPLATE)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
            <Flame size={15} className="text-cx-amber" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-amber-800 font-body">Firebase not configured yet</p>
            <p className="text-xs text-amber-600 font-body">Add Firebase keys to enable Google & GitHub login</p>
          </div>
        </div>
        {open
          ? <ChevronUp size={16} className="text-amber-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-amber-500 flex-shrink-0" />
        }
      </button>

      {/* Expandable steps */}
      {open && (
        <div className="px-4 pb-4 border-t border-amber-200 pt-4 space-y-3 animate-fade-in">
          {steps.map(s => (
            <div key={s.num} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cx-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {s.num}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 font-body">{s.title}</p>
                <p className="text-xs text-amber-600 font-body mt-0.5">{s.desc}</p>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cx-indigo font-semibold hover:underline mt-1 font-body">
                    {s.linkText} <ExternalLink size={10} />
                  </a>
                )}
                {s.code && (
                  <div className="mt-2 relative">
                    <div className="bg-white border border-amber-200 rounded-xl p-3 font-mono text-xs text-amber-900 leading-relaxed whitespace-pre">
                      {ENV_TEMPLATE}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="absolute top-2 right-2 flex items-center gap-1 text-xs font-body font-medium text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg transition-all"
                    >
                      {copied ? <Check size={11} className="text-cx-emerald" /> : <Copy size={11} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="mt-3 p-3 bg-white border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 font-body">
              After adding keys → <strong>restart dev server</strong> with <code className="bg-amber-100 px-1 rounded font-mono">npm run dev</code>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
