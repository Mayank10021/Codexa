import { useState } from 'react'
import { Bug, ChevronDown, AlertTriangle, Shield, Zap, CheckCircle, Info, Wrench, Sparkles, Copy, Check } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import AIResponse from '../components/AIResponse'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { checkCode, fixCode } from '../services/aiService'
import { LANGUAGES, copyToClipboard } from '../utils/helpers'

const EXAMPLE = `function getUserData(userId) {
  var query = "SELECT * FROM users WHERE id = " + userId;
  var result = db.execute(query);
  
  for(var i = 0; i < result.length; i++) {
    console.log(result[i]);
  }
  
  return result;
}

var userData = getUserData(req.params.id);`

function ScoreRing({ score }) {
  const color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#E11D48'
  const bgColor = score >= 80 ? '#D1FAE5' : score >= 60 ? '#FEF3C7' : '#FFE4E6'
  const label = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor'
  const r = 36, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#F5F5F4" strokeWidth="7" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-xl" style={{ color }}>{score}</span>
          <span className="text-cx-faint text-xs font-body">/100</span>
        </div>
      </div>
      <span className="text-xs font-semibold font-body px-2.5 py-0.5 rounded-full" style={{ color, backgroundColor: bgColor }}>{label}</span>
    </div>
  )
}

export default function Checker() {
  const [code, setCode] = useState(EXAMPLE)
  const [language, setLanguage] = useState('JavaScript')
  const [fixResult, setFixResult] = useState(null)
  const [fixing, setFixing] = useState(false)
  const [fixError, setFixError] = useState(null)
  const [copied, setCopied] = useState(false)
  const { loading, result, error, execute } = useAI(checkCode, 'checker')

  const handleCheck = () => { if (code.trim()) execute(code, language) }

  const handleAutoFix = async () => {
    if (!result) return
    setFixing(true); setFixError(null); setFixResult(null)
    try {
      const issues = [
        ...(result.errors || []),
        ...(result.security || []),
        ...(result.performance || []),
        ...(result.style || []),
      ]
      const fixed = await fixCode(code, language, issues)
      setFixResult(fixed)
    } catch (e) {
      setFixError(e.message)
    } finally { setFixing(false) }
  }

  const totalIssues = result ? (result.errors?.length || 0) + (result.security?.length || 0) + (result.performance?.length || 0) : 0

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center">
          <Bug size={18} className="text-cx-rose" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Bug Checker & Auto-Fixer</h1>
          <p className="text-cx-muted text-sm font-body">Detect issues and fix them automatically with AI</p>
        </div>
      </div>

      {/* Input */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Language</label>
            <div className="relative">
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="select-field appearance-none pr-8">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-auto">
            <button onClick={handleCheck} disabled={loading || !code.trim()}
              className="btn-danger flex items-center gap-2 disabled:opacity-50">
              <Bug size={15} /> {loading ? 'Analyzing...' : 'Analyze code'}
            </button>
            {result && totalIssues > 0 && (
              <button onClick={handleAutoFix} disabled={fixing}
                className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Sparkles size={15} /> {fixing ? 'Fixing...' : `Auto-fix ${totalIssues} issue${totalIssues>1?'s':''}`}
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">Paste your code</label>
          <CodeEditor value={code} onChange={setCode} language={language} height="260px" />
        </div>
      </div>

      {loading && <LoadingState message="Scanning for bugs and vulnerabilities" />}
      {error && <ErrorState error={error} onRetry={handleCheck} />}

      {result && !loading && (
        <div className="space-y-4 animate-fade-up">
          {/* Score */}
          <div className="card flex flex-col sm:flex-row items-center gap-5">
            <ScoreRing score={result.score || 0} />
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-cx-text mb-1">Analysis complete</h3>
              <p className="text-cx-muted text-sm font-body leading-relaxed">{result.summary}</p>
              {result.positives?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {result.positives.map((p, i) => (
                    <span key={i} className="badge-emerald flex items-center gap-1 text-xs">
                      <CheckCircle size={10} /> {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Summary counts */}
            <div className="flex gap-3 flex-shrink-0">
              {[
                { count: result.errors?.length || 0, label: 'Errors', color: 'text-cx-rose', bg: 'bg-rose-50' },
                { count: result.security?.length || 0, label: 'Security', color: 'text-orange-600', bg: 'bg-orange-50' },
                { count: result.performance?.length || 0, label: 'Performance', color: 'text-cx-amber', bg: 'bg-amber-50' },
              ].map(s => (
                <div key={s.label} className={`flex flex-col items-center p-3 rounded-xl ${s.bg} min-w-[60px]`}>
                  <span className={`font-display font-extrabold text-xl ${s.color}`}>{s.count}</span>
                  <span className={`text-xs font-body ${s.color}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {result.errors?.length > 0 && (
            <div className="card">
              <h3 className="font-display font-bold text-base text-cx-text mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-cx-rose" /> Code Issues
                <span className="badge-rose">{result.errors.length}</span>
              </h3>
              <div className="space-y-3">
                {result.errors.map((e, i) => {
                  const cfg = e.severity === 'error' ? 'result-error' : e.severity === 'warning' ? 'result-warning' : 'result-info'
                  const tc = e.severity === 'error' ? 'text-cx-rose' : e.severity === 'warning' ? 'text-cx-amber' : 'text-cx-sky'
                  return (
                    <div key={i} className={cfg}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className={`${tc} mt-0.5 flex-shrink-0`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-mono font-bold uppercase ${tc}`}>{e.severity}</span>
                            {e.line && <span className="text-cx-faint text-xs font-mono">Line {e.line}</span>}
                          </div>
                          <p className="text-cx-sub text-sm font-body">{e.message}</p>
                          {e.fix && <p className="text-cx-muted text-xs mt-1 font-body">→ <strong>Fix:</strong> {e.fix}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Security */}
          {result.security?.length > 0 && (
            <div className="card">
              <h3 className="font-display font-bold text-base text-cx-text mb-4 flex items-center gap-2">
                <Shield size={16} className="text-orange-600" /> Security Issues
                <span className="badge-amber">{result.security.length}</span>
              </h3>
              <div className="space-y-3">
                {result.security.map((s, i) => (
                  <div key={i} className="result-warning">
                    <p className="font-semibold text-sm text-amber-800 font-body mb-1">{s.issue}</p>
                    <p className="text-amber-700 text-xs mb-2 font-body">{s.description}</p>
                    {s.fix && <p className="text-emerald-700 text-xs font-body">✓ Fix: {s.fix}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
          {result.performance?.length > 0 && (
            <div className="card">
              <h3 className="font-display font-bold text-base text-cx-text mb-4 flex items-center gap-2">
                <Zap size={16} className="text-cx-amber" /> Performance
                <span className="badge-amber">{result.performance.length}</span>
              </h3>
              <div className="space-y-3">
                {result.performance.map((p, i) => (
                  <div key={i} className="result-info">
                    <p className="font-semibold text-sm text-sky-800 font-body mb-1">{p.issue}</p>
                    <p className="text-sky-700 text-xs mb-2 font-body">{p.description}</p>
                    {p.suggestion && <p className="text-cx-indigo text-xs font-body">→ {p.suggestion}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Style */}
          {result.style?.length > 0 && (
            <div className="card">
              <h3 className="font-display font-bold text-base text-cx-text mb-4 flex items-center gap-2">
                <Info size={16} className="text-cx-sky" /> Style Issues
                <span className="badge-sky">{result.style.length}</span>
              </h3>
              <div className="space-y-2">
                {result.style.map((s, i) => (
                  <div key={i} className="p-3 bg-cx-bg rounded-xl border border-cx-border">
                    <p className="font-semibold text-xs text-cx-sub font-body">{s.issue}</p>
                    <p className="text-cx-muted text-xs mt-0.5 font-body">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auto-fix result */}
      {fixing && <LoadingState message="Auto-fixing all issues" />}
      {fixError && <ErrorState error={fixError} />}
      {fixResult && !fixing && (
        <div className="card animate-fade-up border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Wrench size={15} className="text-cx-emerald" />
            </div>
            <h3 className="font-display font-bold text-cx-text">Auto-fixed code</h3>
            <span className="badge-emerald">All issues resolved</span>
          </div>
          <AIResponse result={fixResult} language={language} toolName="fixed-code" />
        </div>
      )}
    </div>
  )
}
