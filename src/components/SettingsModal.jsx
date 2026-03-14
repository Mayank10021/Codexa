import { useState, useEffect } from 'react'
import { X, Key, Eye, EyeOff, Check, ExternalLink, Zap, CheckCircle, Lock } from 'lucide-react'
import { hasEnvKey } from '../services/aiService'

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)
  const envKeyPresent = hasEnvKey()

  useEffect(() => {
    if (isOpen) setApiKey(localStorage.getItem('cx_api_key') || '')
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    localStorage.setItem('cx_api_key', apiKey.trim())
    setSaved(true); setTimeout(() => { setSaved(false); onClose() }, 1200)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl border border-cx-border shadow-lift p-6 animate-bounce-soft">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cx-indigo-light rounded-xl flex items-center justify-center">
              <Key size={16} className="text-cx-indigo" />
            </div>
            <div>
              <h2 className="font-display font-bold text-cx-text">API Settings</h2>
              <p className="text-xs text-cx-faint font-body">Configure your AI provider</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cx-bg transition-colors text-cx-faint">
            <X size={16} />
          </button>
        </div>

        {/* Status banner */}
        {envKeyPresent ? (
          <div className="mb-5 flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <CheckCircle size={16} className="text-cx-emerald flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-cx-emerald font-body">Site API key is active</p>
              <p className="text-xs text-emerald-600">All users can use this site without their own key</p>
            </div>
          </div>
        ) : (
          <div className="mb-5 flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Zap size={16} className="text-cx-amber flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-cx-amber font-body">No site key found — personal key mode</p>
              <p className="text-xs text-amber-600">Add VITE_GROQ_API_KEY to your .env file to go public</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-cx-sub font-body">Your personal Groq API Key</label>
              <span className="text-xs text-cx-faint font-body">Overrides site key</span>
            </div>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={apiKey}
                onChange={e => setApiKey(e.target.value)} placeholder="gsk_..."
                className="input-field pr-10" />
              <button onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint hover:text-cx-muted transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cx-indigo hover:underline mt-2 font-body font-medium">
              Get a free key at console.groq.com <ExternalLink size={10} />
            </a>
          </div>

          {/* .env instructions for site owner */}
          <div className="p-4 bg-cx-bg border border-cx-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={12} className="text-cx-indigo" />
              <p className="text-xs font-semibold text-cx-sub font-body">To make your site public (for all visitors):</p>
            </div>
            <div className="bg-white rounded-lg border border-cx-border p-2 font-mono text-xs text-cx-indigo">
              VITE_GROQ_API_KEY=gsk_your_key_here
            </div>
            <p className="text-xs text-cx-faint mt-1.5 font-body">Add this to your <strong>.env</strong> file and rebuild</p>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saved ? <><Check size={14} /> Saved!</> : 'Save key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
