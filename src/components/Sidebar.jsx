import { Link, useLocation } from 'react-router-dom'
import { Code2, Bug, BookOpen, ArrowLeftRight, Zap, BookMarked, Github, LayoutDashboard, Wrench } from 'lucide-react'

const tools = [
  { path: '/generator', icon: Code2, label: 'Code Generator', dot: 'bg-indigo-400' },
  { path: '/checker', icon: Bug, label: 'Bug Checker', dot: 'bg-rose-400' },
  { path: '/explainer', icon: BookOpen, label: 'Explainer', dot: 'bg-sky-400' },
  { path: '/converter', icon: ArrowLeftRight, label: 'Converter', dot: 'bg-violet-400' },
  { path: '/optimizer', icon: Zap, label: 'Optimizer', dot: 'bg-amber-400' },
  { path: '/debugger', icon: Wrench, label: 'AI Debugger', dot: 'bg-rose-400' },
]

const library = [
  { path: '/snippets', icon: BookMarked, label: 'Snippets', dot: 'bg-emerald-400' },
  { path: '/github', icon: Github, label: 'Repo Analyzer', dot: 'bg-gray-400' },
]

export default function Sidebar() {
  const loc = useLocation()

  const Item = ({ path, icon: Icon, label, dot }) => {
    const active = loc.pathname === path
    return (
      <Link to={path}>
        <div className={`sidebar-link ${active ? 'active' : ''}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'bg-cx-indigo' : dot}`} />
          <Icon size={15} />
          <span>{label}</span>
        </div>
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-cx-sidebar border-r border-cx-border overflow-y-auto z-40 hidden md:flex flex-col">
      <div className="flex-1 p-3 space-y-0.5">
        <Link to="/dashboard">
          <div className={`sidebar-link ${loc.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${loc.pathname === '/dashboard' ? 'bg-cx-indigo' : 'bg-gray-300'}`} />
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </div>
        </Link>

        <div className="pt-3">
          <p className="section-label">AI Tools</p>
          {tools.map(t => <Item key={t.path} {...t} />)}
        </div>

        <div className="pt-3">
          <p className="section-label">Library</p>
          {library.map(t => <Item key={t.path} {...t} />)}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-cx-border space-y-2">
        <div className="px-3 py-2 rounded-xl bg-cx-indigo-light border border-cx-indigo-mid">
          <p className="text-xs font-semibold text-cx-indigo font-body">Powered by Groq AI</p>
          <p className="text-xs text-indigo-400 mt-0.5">Llama 3.3 70B model</p>
        </div>
        <div className="px-3 py-2 rounded-xl bg-cx-bg border border-cx-border">
          <p className="text-xs text-cx-faint font-body">Developed by</p>
          <p className="text-xs font-bold text-cx-sub font-display">Mayank Aneja</p>
        </div>
      </div>
    </aside>
  )
}
