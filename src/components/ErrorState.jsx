import { AlertCircle, RefreshCw, Key } from 'lucide-react'

export default function ErrorState({ error, onRetry }) {
  const isApiKey = error?.toLowerCase().includes('api key') || error?.toLowerCase().includes('settings')
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 bg-cx-rose-light rounded-2xl flex items-center justify-center">
        <AlertCircle size={22} className="text-cx-rose" />
      </div>
      <div className="text-center max-w-sm">
        <p className="font-display font-bold text-cx-text mb-1">Something went wrong</p>
        <p className="text-cx-muted text-sm font-body leading-relaxed">{error}</p>
        {isApiKey && (
          <div className="mt-3 p-3 bg-cx-amber-light border border-amber-200 rounded-xl flex items-start gap-2 text-left">
            <Key size={14} className="text-cx-amber mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-body">Click <strong>Settings</strong> in the top bar to add your free Groq API key from console.groq.com</p>
          </div>
        )}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  )
}
