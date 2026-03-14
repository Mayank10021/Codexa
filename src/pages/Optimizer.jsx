import { useState } from 'react'
import { Zap, ChevronDown } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import AIResponse from '../components/AIResponse'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { optimizeCode } from '../services/aiService'
import { LANGUAGES } from '../utils/helpers'

const EXAMPLE = `function findDuplicates(arr) {
  var duplicates = [];
  for(var i = 0; i < arr.length; i++) {
    for(var j = i + 1; j < arr.length; j++) {
      if(arr[i] === arr[j]) {
        var found = false;
        for(var k = 0; k < duplicates.length; k++) {
          if(duplicates[k] === arr[i]) found = true;
        }
        if(!found) duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`

export default function Optimizer() {
  const [code, setCode] = useState(EXAMPLE)
  const [language, setLanguage] = useState('JavaScript')
  const { loading, result, error, execute } = useAI(optimizeCode, 'optimizer')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
          <Zap size={18} className="text-cx-amber" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Code Optimizer</h1>
          <p className="text-cx-muted text-sm font-body">Improve performance, readability, and best practices</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-cx-sub font-body">Original code</label>
            <div className="relative">
              <select value={language} onChange={e => setLanguage(e.target.value)} className="select-field text-xs py-1.5 px-3 appearance-none pr-7">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
            </div>
          </div>
          <CodeEditor value={code} onChange={setCode} language={language} height="380px" />
          <button onClick={() => code.trim() && execute(code, language)} disabled={loading || !code.trim()}
            className="w-full flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl text-white transition-all shadow-soft disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: '#D97706' }}>
            <Zap size={15} /> {loading ? 'Optimizing...' : 'Optimize code'}
          </button>
        </div>

        <div className="card min-h-[460px]">
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                <Zap size={26} className="text-amber-200" />
              </div>
              <div className="text-center">
                <p className="text-cx-sub font-semibold text-sm font-body">Paste slow or messy code</p>
                <p className="text-cx-faint text-xs mt-1">AI will optimize it for performance & clarity</p>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {['Performance', 'Readability', 'Best Practices'].map(t => (
                  <div key={t} className="bg-amber-50 border border-amber-100 rounded-xl py-2 px-3 text-center">
                    <Zap size={12} className="text-cx-amber mx-auto mb-1" />
                    <span className="text-amber-700 text-xs font-body font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading && <LoadingState message="Optimizing your code" />}
          {error && <ErrorState error={error} />}
          {result && !loading && <AIResponse result={result} language={language} toolName="optimized" />}
        </div>
      </div>
    </div>
  )
}
