import { Link } from 'react-router-dom'
import { Sparkles, Github, Twitter, Linkedin, Heart, Code2, ExternalLink, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-cx-border mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-cx-indigo rounded-lg flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-cx-text">Codexa</span>
            </div>
            <p className="text-cx-muted text-sm font-body leading-relaxed mb-4 max-w-xs">
              AI-powered developer platform. Generate, debug, explain, convert and optimize code — all in one place.
            </p>
            {/* Developer credit — prominent */}
            <div className="inline-flex items-center gap-2 bg-cx-indigo-light border border-cx-indigo-mid rounded-xl px-4 py-2.5">
              <Code2 size={14} className="text-cx-indigo" />
              <div>
                <p className="text-xs text-cx-indigo font-body font-semibold">Designed & Developed by</p>
                <p className="text-sm font-display font-bold text-cx-indigo">Mayank Aneja</p>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs font-semibold text-cx-sub uppercase tracking-wider mb-3 font-body">Tools</p>
            <ul className="space-y-2">
              {[
                { label: 'Code Generator', path: '/generator' },
                { label: 'Bug Checker', path: '/checker' },
                { label: 'Code Explainer', path: '/explainer' },
                { label: 'Converter', path: '/converter' },
                { label: 'Optimizer', path: '/optimizer' },
                { label: 'AI Debugger', path: '/debugger' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-cx-muted hover:text-cx-indigo text-sm font-body transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold text-cx-sub uppercase tracking-wider mb-3 font-body">More</p>
            <ul className="space-y-2">
              {[
                { label: 'Snippet Library', path: '/snippets' },
                { label: 'Repo Analyzer', path: '/github' },
                { label: 'Dashboard', path: '/dashboard' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-cx-muted hover:text-cx-indigo text-sm font-body transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
                  className="text-cx-muted hover:text-cx-indigo text-sm font-body transition-colors flex items-center gap-1">
                  Get Free API Key <ExternalLink size={10} />
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-2 mt-5">
              <a href="https://github.com/mayank10021" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-cx-bg border border-cx-border rounded-lg flex items-center justify-center text-cx-muted hover:text-cx-indigo hover:border-cx-indigo-mid transition-all">
                <Github size={14} />
              </a>
              <a href="https://linkedin.com/in/mayank-aneja-866015331" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-cx-bg border border-cx-border rounded-lg flex items-center justify-center text-cx-muted hover:text-cx-indigo hover:border-cx-indigo-mid transition-all">
                <Linkedin size={14} />
              </a>
              <a href="https://instagram.com/hey_its.mynk" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-cx-bg border border-cx-border rounded-lg flex items-center justify-center text-cx-muted hover:text-cx-indigo hover:border-cx-indigo-mid transition-all">
                <Instagram size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cx-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cx-faint text-xs font-body flex items-center gap-1.5">
            © {new Date().getFullYear()} Codexa. Built with
            <Heart size={11} className="text-cx-rose fill-cx-rose" />
            by
            <span className="font-semibold text-cx-sub">Mayank Aneja</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-cx-faint text-xs font-body">Powered by Groq · Llama 3.3 70B</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-cx-emerald rounded-full animate-pulse" />
              <span className="text-cx-faint text-xs font-body">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
