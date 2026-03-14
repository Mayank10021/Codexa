import { Link } from 'react-router-dom'
import { Sparkles, Code2, Bug, BookOpen, ArrowLeftRight, Zap, BookMarked, Github, Wrench, ChevronRight, Check, Star } from 'lucide-react'

const tools = [
  { icon: Code2, label: 'Code Generator', desc: 'Generate production-ready code from plain English', path: '/generator', color: 'bg-indigo-50 text-cx-indigo border-indigo-100' },
  { icon: Bug, label: 'Bug Checker & Fixer', desc: 'Detect issues and auto-fix them with one click', path: '/checker', color: 'bg-rose-50 text-cx-rose border-rose-100', badge: 'Auto-Fix!' },
  { icon: BookOpen, label: 'Code Explainer', desc: 'Understand any code with step-by-step explanations', path: '/explainer', color: 'bg-sky-50 text-cx-sky border-sky-100' },
  { icon: ArrowLeftRight, label: 'Language Converter', desc: 'Convert between 20+ programming languages instantly', path: '/converter', color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { icon: Zap, label: 'Code Optimizer', desc: 'Improve performance and modernize your code', path: '/optimizer', color: 'bg-amber-50 text-cx-amber border-amber-100' },
  { icon: Wrench, label: 'AI Debugger', desc: 'Paste any error and get an instant fix', path: '/debugger', color: 'bg-rose-50 text-cx-rose border-rose-100' },
  { icon: BookMarked, label: 'Snippet Library', desc: 'Save and organize your reusable code snippets', path: '/snippets', color: 'bg-emerald-50 text-cx-emerald border-emerald-100' },
  { icon: Github, label: 'Repo Analyzer', desc: 'Analyze GitHub repositories for quality and security', path: '/github', color: 'bg-gray-50 text-gray-600 border-gray-100' },
]

const testimonials = [
  { name: 'Aryan K.', role: 'Backend Engineer', text: 'The auto-fix feature saves me 30 minutes every day. Just incredible.', stars: 5 },
  { name: 'Priya S.', role: 'CS Student', text: 'Finally an AI tool that actually explains code properly. Love the explainer!', stars: 5 },
  { name: 'Rohan M.', role: 'Freelance Dev', text: 'Converted my entire Node.js project to Go in one afternoon. Mind-blowing.', stars: 5 },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-cx-bg">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#EEF2FF_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-cx-indigo-mid to-transparent" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-cx-border rounded-full px-4 py-1.5 text-xs font-semibold text-cx-indigo shadow-soft mb-7 font-body">
            <span className="w-1.5 h-1.5 bg-cx-emerald rounded-full animate-pulse" />
            Built by Mayank Aneja · Auto-Fix · Free with Groq API
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-cx-text leading-tight mb-5">
            The AI platform for<br />
            <span className="text-cx-indigo">developers who ship.</span>
          </h1>

          <p className="text-cx-muted text-lg font-body leading-relaxed max-w-xl mx-auto mb-9">
            Generate, debug, explain, convert and optimize code with AI. 7 powerful tools in one beautiful platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              <Sparkles size={17} /> Get started free
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
              Sign in <ChevronRight size={15} />
            </Link>
          </div>

          <p className="text-cx-faint text-xs mt-5 font-body">No credit card required · Free with your Groq API key</p>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-cx-text mb-3">8 tools. One platform.</h2>
            <p className="text-cx-muted font-body">Everything you need to write better code, faster.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map(t => (
              <Link key={t.path} to={t.path}>
                <div className="card-hover h-full relative group">
                  {t.badge && (
                    <span className="absolute top-4 right-4 badge-amber text-xs">{t.badge}</span>
                  )}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-4 ${t.color}`}>
                    <t.icon size={17} />
                  </div>
                  <h3 className="font-display font-bold text-sm text-cx-text mb-1.5 group-hover:text-cx-indigo transition-colors">{t.label}</h3>
                  <p className="text-cx-muted text-xs font-body leading-relaxed">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white border-y border-cx-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-2xl text-cx-text">Loved by developers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex mb-3">
                  {Array(t.stars).fill(0).map((_,i) => <Star key={i} size={13} className="text-cx-amber fill-cx-amber" />)}
                </div>
                <p className="text-cx-sub text-sm font-body leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cx-indigo-light flex items-center justify-center text-cx-indigo text-xs font-bold">{t.name[0]}</div>
                  <div>
                    <p className="text-xs font-semibold text-cx-text">{t.name}</p>
                    <p className="text-xs text-cx-faint">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-cx-indigo rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display font-extrabold text-3xl text-white mb-3">Start coding smarter today.</h2>
              <p className="text-indigo-200 font-body mb-7">Free forever with your own API key. Takes 2 minutes to set up.</p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-cx-indigo font-semibold px-7 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-soft text-sm font-body">
                <Sparkles size={16} /> Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
