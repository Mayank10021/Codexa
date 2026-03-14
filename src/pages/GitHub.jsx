import { useState } from 'react'
import { Github, Search, GitBranch } from 'lucide-react'
import AIResponse from '../components/AIResponse'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import { useAI } from '../hooks/useAI'
import { analyzeRepo } from '../services/aiService'

const EXAMPLES = [
  'https://github.com/facebook/react',
  'https://github.com/vercel/next.js',
  'https://github.com/tailwindlabs/tailwindcss',
  'https://github.com/expressjs/express',
  'https://github.com/vitejs/vite',
  'https://github.com/prisma/prisma',
]

export default function GitHub() {
  const [repoUrl, setRepoUrl] = useState('')
  const { loading, result, error, execute } = useAI(analyzeRepo, 'github')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
          <Github size={18} className="text-gray-600" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">Repository Analyzer</h1>
          <p className="text-cx-muted text-sm font-body">Analyze GitHub repos for quality, security & architecture</p>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="block text-xs font-semibold text-cx-sub mb-2 font-body">GitHub Repository URL</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cx-faint" />
              <input value={repoUrl} onChange={e => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="input-field pl-9"
                onKeyDown={e => e.key === 'Enter' && repoUrl.trim() && execute(repoUrl)} />
            </div>
            <button onClick={() => repoUrl.trim() && execute(repoUrl)} disabled={loading || !repoUrl.trim()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 whitespace-nowrap">
              <Search size={15} /> {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-cx-sub mb-2 font-body">Try a popular repo</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map(r => {
              const name = r.replace('https://github.com/', '')
              return (
                <button key={r} onClick={() => setRepoUrl(r)}
                  className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-all
                    ${repoUrl===r ? 'bg-cx-indigo-light text-cx-indigo border-cx-indigo-mid' : 'bg-white border-cx-border text-cx-muted hover:border-cx-indigo-mid hover:text-cx-indigo'}`}>
                  <GitBranch size={10} /> {name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {!result && !loading && (
        <div className="card border-dashed">
          <div className="flex gap-3 items-start">
            <Github size={18} className="text-cx-faint flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-cx-sub font-body mb-1">How it works</p>
              <p className="text-cx-muted text-sm font-body leading-relaxed">
                Enter any GitHub URL and AI will provide insights on tech stack, architecture patterns, code quality recommendations, security checklist, and performance suggestions.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Analyzing repository" />}
      {error && <ErrorState error={error} />}
      {result && !loading && (
        <div className="card"><AIResponse result={result} toolName="repo-analysis" /></div>
      )}
    </div>
  )
}
