import { useState } from 'react'
import { Wrench, ChevronDown } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import AIResponse from '../components/AIResponse'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { debugCode } from '../services/aiService'
import { LANGUAGES } from '../utils/helpers'

const QUICK_ERRORS = [
  "TypeError: Cannot read properties of undefined",
  "ReferenceError: variable is not defined",
  "SyntaxError: Unexpected token",
  "TypeError: is not a function",
  "CORS error: Access blocked by CORS policy",
  "Cannot set headers after they are sent",
  "UnhandledPromiseRejectionWarning",
  "SegmentationFault (SIGSEGV)",
]

export default function Debugger() {
  const [errorMsg, setErrorMsg] = useState('')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const { loading, result, error, execute } = useAI(debugCode, 'debugger')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center">
          <Wrench size={18} className="text-cx-rose" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">AI Debugger</h1>
          <p className="text-cx-muted text-sm font-body">Paste your error message — AI diagnoses and fixes it</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">Error message *</label>
              <textarea value={errorMsg} onChange={e => setErrorMsg(e.target.value)}
                placeholder="Paste your error here...&#10;e.g. TypeError: Cannot read properties of undefined (reading 'map')"
                rows={4} className="input-field font-mono text-xs text-cx-rose" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cx-sub mb-2 font-body">Common errors</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ERRORS.map(e => (
                  <button key={e} onClick={() => setErrorMsg(e)}
                    className="text-xs font-mono px-2 py-1 bg-cx-bg border border-cx-border rounded-lg text-cx-muted hover:text-cx-rose hover:border-rose-200 transition-all">
                    {e.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Language</label>
                <div className="relative">
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="select-field w-full appearance-none pr-8">
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">Your code (optional but helps)</label>
              <CodeEditor value={code} onChange={setCode} language={language} height="200px" placeholder="// Paste the code that caused the error..." />
            </div>
            <button onClick={() => errorMsg.trim() && execute(errorMsg, code, language)} disabled={loading || !errorMsg.trim()}
              className="btn-danger w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              <Wrench size={15} /> {loading ? 'Diagnosing...' : 'Debug this error'}
            </button>
          </div>
        </div>

        <div className="card min-h-[500px]">
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center">
                <Wrench size={24} className="text-rose-200" />
              </div>
              <div className="text-center">
                <p className="text-cx-sub font-semibold text-sm font-body">Paste an error message to debug</p>
                <p className="text-cx-faint text-xs mt-1">AI explains the root cause and provides a fix</p>
              </div>
            </div>
          )}
          {loading && <LoadingState message="Diagnosing the error" />}
          {error && <ErrorState error={error} />}
          {result && !loading && <AIResponse result={result} language={language} toolName="debug-fix" />}
        </div>
      </div>
    </div>
  )
}
