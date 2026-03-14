import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Bug, BookOpen, ArrowLeftRight, Zap, BookMarked, Github, Wrench, Clock, Trash2, ChevronRight, TrendingUp } from 'lucide-react'
import { getHistory, clearHistory } from '../services/aiService'
import { getSnippets } from '../services/snippetService'
import { timeAgo } from '../utils/helpers'

const toolMeta = {
  generator: { icon: Code2, label: 'Generator', color: 'text-cx-indigo', bg: 'bg-indigo-50', path: '/generator' },
  checker:   { icon: Bug, label: 'Bug Checker', color: 'text-cx-rose', bg: 'bg-rose-50', path: '/checker' },
  explainer: { icon: BookOpen, label: 'Explainer', color: 'text-cx-sky', bg: 'bg-sky-50', path: '/explainer' },
  converter: { icon: ArrowLeftRight, label: 'Converter', color: 'text-violet-600', bg: 'bg-violet-50', path: '/converter' },
  optimizer: { icon: Zap, label: 'Optimizer', color: 'text-cx-amber', bg: 'bg-amber-50', path: '/optimizer' },
  debugger:  { icon: Wrench, label: 'Debugger', color: 'text-cx-rose', bg: 'bg-rose-50', path: '/debugger' },
  github:    { icon: Github, label: 'Repo Analyzer', color: 'text-gray-600', bg: 'bg-gray-50', path: '/github' },
}

const quickTools = [
  { path: '/generator', icon: Code2, label: 'Generate', color: 'bg-indigo-50 text-cx-indigo border-indigo-100' },
  { path: '/checker', icon: Bug, label: 'Check & Fix', color: 'bg-rose-50 text-cx-rose border-rose-100' },
  { path: '/explainer', icon: BookOpen, label: 'Explain', color: 'bg-sky-50 text-cx-sky border-sky-100' },
  { path: '/converter', icon: ArrowLeftRight, label: 'Convert', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { path: '/optimizer', icon: Zap, label: 'Optimize', color: 'bg-amber-50 text-cx-amber border-amber-100' },
  { path: '/debugger', icon: Wrench, label: 'Debug', color: 'bg-rose-50 text-cx-rose border-rose-100' },
  { path: '/snippets', icon: BookMarked, label: 'Snippets', color: 'bg-emerald-50 text-cx-emerald border-emerald-100' },
  { path: '/github', icon: Github, label: 'Repos', color: 'bg-gray-50 text-gray-600 border-gray-200' },
]

export default function Dashboard({ user }) {
  const [history, setHistory] = useState([])
  const [snippets, setSnippets] = useState([])

  useEffect(() => { setHistory(getHistory()); setSnippets(getSnippets()) }, [])

  const toolUsage = history.reduce((a, i) => ({ ...a, [i.tool]: (a[i.tool]||0)+1 }), {})
  const topTool = Object.entries(toolUsage).sort((a,b)=>b[1]-a[1])[0]
  const topMeta = topTool ? toolMeta[topTool[0]] : null

  return (
    <div className="space-y-7">
      {/* Welcome */}
      <div className="bg-white rounded-2xl border border-cx-border shadow-soft p-5 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-cx-text">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-cx-muted text-sm font-body mt-0.5">Ready to build something great?</p>
        </div>
        <Link to="/generator" className="btn-primary hidden sm:flex items-center gap-2">
          <Code2 size={15} /> New generation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI Requests', value: history.length, icon: TrendingUp, color: 'text-cx-indigo', bg: 'bg-cx-indigo-light' },
          { label: 'Snippets', value: snippets.length, icon: BookMarked, color: 'text-cx-emerald', bg: 'bg-emerald-50' },
          { label: 'Favorites', value: snippets.filter(s=>s.favorite).length, icon: Zap, color: 'text-cx-amber', bg: 'bg-amber-50' },
          { label: 'Top Tool', value: topMeta?.label || '—', icon: topMeta?.icon || Code2, color: topMeta?.color || 'text-cx-muted', bg: topMeta?.bg || 'bg-gray-50' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-cx-faint text-xs font-body mb-1.5">{s.label}</p>
                <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
              </div>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={15} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick tools */}
      <div>
        <h2 className="font-display font-semibold text-cx-text mb-3">Quick access</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {quickTools.map(t => (
            <Link key={t.path} to={t.path}>
              <div className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${t.color} hover:scale-105 transition-all text-center cursor-pointer bg-white`}>
                <t.icon size={17} />
                <span className="text-xs font-body font-semibold leading-tight">{t.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-cx-text flex items-center gap-2">
              <Clock size={15} className="text-cx-faint" /> Recent activity
            </h2>
            {history.length > 0 && (
              <button onClick={() => { clearHistory(); setHistory([]) }}
                className="text-cx-faint hover:text-cx-rose transition-colors text-xs flex items-center gap-1 font-body">
                <Trash2 size={11} /> Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="card text-center py-10">
              <Clock size={22} className="text-cx-faint mx-auto mb-2" />
              <p className="text-cx-muted text-sm font-body">No activity yet</p>
              <Link to="/generator" className="btn-primary mt-4 inline-flex text-xs py-2 px-4">Try a tool</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {history.slice(0,7).map(item => {
                const m = toolMeta[item.tool] || { icon: Code2, label: item.tool, color: 'text-cx-muted', bg: 'bg-gray-50', path: '/' }
                return (
                  <Link key={item.id} to={m.path}>
                    <div className="bg-white rounded-xl border border-cx-border px-4 py-3 hover:border-cx-border2 hover:shadow-soft transition-all flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center flex-shrink-0`}>
                        <m.icon size={14} className={m.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold font-body ${m.color}`}>{m.label}</span>
                          <span className="text-cx-faint text-xs">{timeAgo(item.createdAt)}</span>
                        </div>
                        <p className="text-cx-muted text-xs font-mono truncate mt-0.5">{item.input}</p>
                      </div>
                      <ChevronRight size={13} className="text-cx-faint flex-shrink-0" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Snippets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-cx-text flex items-center gap-2">
              <BookMarked size={15} className="text-cx-faint" /> Recent snippets
            </h2>
            <Link to="/snippets" className="text-cx-indigo text-xs font-body font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {snippets.length === 0 ? (
            <div className="card text-center py-10">
              <BookMarked size={22} className="text-cx-faint mx-auto mb-2" />
              <p className="text-cx-muted text-sm font-body">No snippets saved yet</p>
              <Link to="/snippets" className="btn-secondary mt-4 inline-flex text-xs py-2 px-4">Open library</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {snippets.slice(0,6).map(s => (
                <Link key={s.id} to="/snippets">
                  <div className="bg-white rounded-xl border border-cx-border px-4 py-3 hover:border-cx-border2 hover:shadow-soft transition-all flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Code2 size={14} className="text-cx-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-cx-sub font-body truncate">{s.title}</span>
                        {s.favorite && <span className="text-cx-amber text-xs">★</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="badge-gray text-xs">{s.language}</span>
                        {s.tags?.slice(0,2).map(t => <span key={t} className="badge-indigo text-xs">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
