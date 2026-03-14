import { useState } from 'react'
import { ArrowLeftRight, ChevronDown, ArrowRight } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import AIResponse from '../components/AIResponse'
import LivePreview from '../components/LivePreview'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { convertCode } from '../services/aiService'
import { LANGUAGES } from '../utils/helpers'

const PRESETS = [
  { from:'Python', to:'JavaScript' }, { from:'JavaScript', to:'TypeScript' },
  { from:'Java', to:'Python' }, { from:'Python', to:'Go' },
  { from:'C++', to:'Java' }, { from:'JavaScript', to:'Python' },
]

const EXAMPLE = `def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`

const WEB_LANGS = ['javascript', 'js', 'html', 'css', 'jsx', 'tsx', 'typescript', 'ts']

export default function Converter() {
  const [code, setCode] = useState(EXAMPLE)
  const [fromLang, setFromLang] = useState('Python')
  const [toLang, setToLang] = useState('JavaScript')
  const [activeTab, setActiveTab] = useState('output')
  const { loading, result, error, execute } = useAI(convertCode, 'converter')

  const handleConvert = () => {
    if (!code.trim()) return
    execute(code, fromLang, toLang)
    if (WEB_LANGS.includes(toLang.toLowerCase())) setActiveTab('preview')
    else setActiveTab('output')
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center">
          <ArrowLeftRight size={18} className="text-violet-600" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Language Converter</h1>
          <p className="text-cx-muted text-sm font-body">Convert code between any programming languages instantly</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={`${p.from}-${p.to}`} onClick={() => { setFromLang(p.from); setToLang(p.to) }}
            className={`flex items-center gap-1.5 text-xs font-body font-medium px-3 py-1.5 rounded-lg border transition-all
              ${fromLang===p.from && toLang===p.to ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-white border-cx-border text-cx-muted hover:border-violet-200 hover:text-violet-600'}`}>
            {p.from} <ArrowRight size={10} /> {p.to}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">From</label>
            <div className="relative">
              <select value={fromLang} onChange={e => setFromLang(e.target.value)} className="select-field w-full appearance-none pr-8">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
            </div>
          </div>
          <button onClick={() => { setFromLang(toLang); setToLang(fromLang) }}
            className="mt-5 p-2.5 border border-cx-border rounded-xl hover:border-violet-200 hover:text-violet-600 text-cx-muted transition-all">
            <ArrowLeftRight size={15} />
          </button>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">To</label>
            <div className="relative">
              <select value={toLang} onChange={e => setToLang(e.target.value)} className="select-field w-full appearance-none pr-8">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card space-y-4">
          <label className="block text-xs font-semibold text-cx-sub font-body">{fromLang} code</label>
          <CodeEditor value={code} onChange={setCode} language={fromLang} height="340px" />
          <button onClick={handleConvert} disabled={loading || !code.trim()}
            className="w-full flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl text-white text-sm transition-all shadow-soft disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: '#7C3AED' }}>
            <ArrowLeftRight size={15} /> {loading ? 'Converting...' : `Convert to ${toLang}`}
          </button>
        </div>

        <div>
          {result && !loading && (
            <div className="flex items-center gap-1 mb-3">
              <button onClick={() => setActiveTab('output')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all ${activeTab==='output' ? 'bg-white border border-cx-border shadow-soft text-cx-text' : 'text-cx-muted hover:text-cx-sub'}`}>
                Code
              </button>
              <button onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all ${activeTab==='preview' ? 'bg-white border border-cx-border shadow-soft text-cx-text' : 'text-cx-muted hover:text-cx-sub'}`}>
                Preview
              </button>
            </div>
          )}

          <div className={`${!result && !loading && !error ? 'card min-h-[420px] flex items-center justify-center' : ''}`}>
            {!result && !loading && !error && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 text-cx-muted">
                  <span className="font-mono text-sm bg-violet-50 text-violet-600 px-2 py-1 rounded-lg">{fromLang}</span>
                  <ArrowRight size={14} />
                  <span className="font-mono text-sm bg-violet-50 text-violet-600 px-2 py-1 rounded-lg">{toLang}</span>
                </div>
                <p className="text-cx-faint text-xs font-body">Converted code will appear here</p>
              </div>
            )}
            {loading && <div className="card"><LoadingState message={`Converting to ${toLang}`} /></div>}
            {error && <div className="card"><ErrorState error={error} /></div>}
            {result && !loading && (
              activeTab === 'output'
                ? <div className="card"><AIResponse result={result} language={toLang} toolName={`converted`} /></div>
                : <LivePreview result={result} language={toLang} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
