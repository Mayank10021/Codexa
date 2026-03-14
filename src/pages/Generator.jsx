import { useState } from 'react'
import { Code2, Sparkles, ChevronDown, RotateCcw } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import AIResponse from '../components/AIResponse'
import LivePreview from '../components/LivePreview'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { generateCode } from '../services/aiService'
import { LANGUAGES } from '../utils/helpers'

const EXAMPLES = [
  'Animated landing page with hero section and features',
  'Beautiful login form with glassmorphism effect',
  'REST API with JWT authentication in Node.js/Express',
  'Interactive todo app with add, delete, and filter',
  'CSS card grid with hover animations',
  'React counter with undo/redo history',
  'Python FastAPI CRUD with SQLAlchemy',
  'MongoDB user schema with Mongoose & validation',
]

const WEB_LANGS = ['HTML', 'CSS', 'JavaScript', 'JSX', 'TSX']

export default function Generator() {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('HTML')
  const [activeTab, setActiveTab] = useState('output') // 'output' | 'preview'
  const { loading, result, error, execute, reset } = useAI(generateCode, 'generator')

  const handleGenerate = () => {
    if (prompt.trim()) {
      execute(prompt, language)
      // Auto-switch to preview tab for web langs
      if (WEB_LANGS.includes(language)) setActiveTab('preview')
      else setActiveTab('output')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cx-indigo-light border border-cx-indigo-mid rounded-xl flex items-center justify-center">
          <Code2 size={18} className="text-cx-indigo" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Code Generator</h1>
          <p className="text-cx-muted text-sm font-body">Describe what you need — AI writes the code with live preview</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">Language</label>
              <div className="relative">
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="select-field w-full appearance-none pr-8">
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
              </div>
              {WEB_LANGS.includes(language) && (
                <p className="text-xs text-cx-emerald font-body mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cx-emerald rounded-full" />
                  Live preview available for {language}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">What do you want to build?</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A beautiful login page with glassmorphism design and smooth animations..."
                rows={5} className="input-field"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }} />
              <p className="text-cx-faint text-xs mt-1 font-body">Ctrl+Enter to generate</p>
            </div>

            <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
              <Sparkles size={15} /> {loading ? 'Generating...' : 'Generate code'}
            </button>

            {result && (
              <button onClick={() => { reset(); setActiveTab('output') }}
                className="btn-ghost w-full flex items-center justify-center gap-2 text-xs">
                <RotateCcw size={12} /> Start over
              </button>
            )}
          </div>

          {/* Examples */}
          <div className="card">
            <p className="text-xs font-semibold text-cx-sub mb-3 font-body">💡 Example prompts</p>
            <div className="space-y-1.5">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => setPrompt(ex)}
                  className="w-full text-left text-xs font-body text-cx-muted hover:text-cx-indigo bg-cx-bg hover:bg-cx-indigo-light border border-cx-border hover:border-cx-indigo-mid rounded-lg px-3 py-2 transition-all">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Output + Preview */}
        <div className="lg:col-span-3">
          {!result && !loading && !error ? (
            <div className="card min-h-[500px] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-cx-indigo-light rounded-2xl flex items-center justify-center">
                <Code2 size={28} className="text-cx-indigo-mid" />
              </div>
              <div className="text-center">
                <p className="text-cx-sub font-semibold font-body text-sm">Your code will appear here</p>
                <p className="text-cx-faint text-xs mt-1">HTML, CSS, JS and React will show a live preview</p>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {['Live Preview', 'Copy & Download', 'Auto-formatted'].map(f => (
                  <div key={f} className="text-center p-2 bg-cx-bg rounded-xl border border-cx-border">
                    <p className="text-cx-faint text-xs font-body">{f}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="card min-h-[500px] flex items-center justify-center">
              <LoadingState message="Writing your code" />
            </div>
          ) : error ? (
            <div className="card"><ErrorState error={error} onRetry={handleGenerate} /></div>
          ) : (
            <>
              {/* Tab switcher */}
              <div className="flex items-center gap-1 mb-3">
                <button onClick={() => setActiveTab('output')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all ${activeTab==='output' ? 'bg-white border border-cx-border shadow-soft text-cx-text' : 'text-cx-muted hover:text-cx-sub'}`}>
                  Code Output
                </button>
                <button onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all flex items-center gap-1.5 ${activeTab==='preview' ? 'bg-white border border-cx-border shadow-soft text-cx-text' : 'text-cx-muted hover:text-cx-sub'}`}>
                  Live Preview
                  {WEB_LANGS.includes(language) && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                </button>
              </div>

              {activeTab === 'output' ? (
                <div className="card">
                  <AIResponse result={result} language={language} toolName="generated-code" />
                </div>
              ) : (
                <LivePreview result={result} language={language} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
