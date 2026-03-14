import { useState } from 'react'
import { BookOpen, ChevronDown } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import LivePreview from "../components/LivePreview"
import AIResponse from '../components/AIResponse'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { explainCode } from '../services/aiService'
import { LANGUAGES } from '../utils/helpers'

const EXAMPLE = `async function fetchUserProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}`

export default function Explainer() {
  const [code, setCode] = useState(EXAMPLE)
  const [language, setLanguage] = useState('JavaScript')
  const { loading, result, error, execute } = useAI(explainCode, 'explainer')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center">
          <BookOpen size={18} className="text-cx-sky" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Code Explainer</h1>
          <p className="text-cx-muted text-sm font-body">Understand any code with AI step-by-step explanations</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
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
            <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">Paste code to explain</label>
            <CodeEditor value={code} onChange={setCode} language={language} height="340px" />
          </div>
          <button onClick={() => code.trim() && execute(code, language)} disabled={loading || !code.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50" style={{ backgroundColor: '#0284C7' }}>
            <BookOpen size={15} /> {loading ? 'Explaining...' : 'Explain this code'}
          </button>
        </div>

        <div className="card min-h-[480px]">
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-72 gap-4">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} className="text-sky-200" />
              </div>
              <div className="text-center">
                <p className="text-cx-sub font-semibold text-sm font-body">Paste any code and click Explain</p>
                <p className="text-cx-faint text-xs mt-1">AI will break it down step by step</p>
              </div>
            </div>
          )}
          {loading && <LoadingState message="Analyzing code structure" />}
          {error && <ErrorState error={error} onRetry={() => execute(code, language)} />}
          {result && !loading && <AIResponse result={result} language={language} toolName="explanation" />}
        </div>
      </div>
    </div>
  )
}
