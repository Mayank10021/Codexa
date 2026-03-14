import { useState, useEffect, useRef } from 'react'
import { Monitor, Code2, RefreshCw, Maximize2, X, AlertCircle, Terminal } from 'lucide-react'
import { extractCodeBlocks } from '../utils/helpers'

const PREVIEWABLE = ['html', 'css', 'javascript', 'js', 'jsx', 'tsx', 'typescript', 'ts']
const WEB_LANGS = ['html', 'css', 'javascript', 'js']
const REACT_LANGS = ['jsx', 'tsx']
const BABEL_CDN = 'https://unpkg.com/@babel/standalone/babel.min.js'

function buildHtmlPreview(code, language) {
  if (language === 'html') return code
  if (language === 'css') {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body>
      <div style="padding:20px;font-family:system-ui">
        <div class="preview-box">CSS Preview — elements styled above</div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn">Button</button>
          <input class="input" placeholder="Input field" style="padding:8px;border-radius:6px;border:1px solid #ccc"/>
          <div class="card" style="padding:12px;border-radius:8px;border:1px solid #eee">Card</div>
        </div>
      </div>
    </body></html>`
  }
  if (language === 'javascript' || language === 'js') {
    return `<!DOCTYPE html><html><head>
      <style>body{font-family:system-ui,sans-serif;padding:16px;background:#fafaf9;color:#1c1917}
      #output{background:#fff;border:1px solid #e8e5de;border-radius:10px;padding:14px;font-family:'Fira Code',monospace;font-size:12px;white-space:pre-wrap;min-height:60px;max-height:300px;overflow:auto}
      .log-line{padding:2px 0;border-bottom:1px solid #f5f5f4}.log-line:last-child{border:none}
      .log-error{color:#e11d48}.log-warn{color:#d97706}.log-info{color:#0284c7}</style>
    </head><body>
      <p style="font-size:11px;color:#78716c;margin:0 0 8px;font-family:system-ui">Console output:</p>
      <div id="output"></div>
      <script>
        const out = document.getElementById('output');
        const orig = {log:console.log,error:console.error,warn:console.warn,info:console.info};
        function addLine(msg, cls='') {
          const d = document.createElement('div');
          d.className = 'log-line ' + cls;
          d.textContent = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
          out.appendChild(d);
        }
        console.log = (...a) => { a.forEach(x => addLine(x)); orig.log(...a); };
        console.error = (...a) => { a.forEach(x => addLine(x,'log-error')); orig.error(...a); };
        console.warn = (...a) => { a.forEach(x => addLine(x,'log-warn')); orig.warn(...a); };
        console.info = (...a) => { a.forEach(x => addLine(x,'log-info')); orig.info(...a); };
        window.onerror = (msg,_,line,col) => { addLine('Error: '+msg+' (line '+line+':'+col+')','log-error'); return true; };
        try { ${code} } catch(e) { addLine('Error: '+e.message, 'log-error'); }
      </script>
    </body></html>`
  }
  return null
}

function buildReactPreview(code) {
  // Wrap React component in a full HTML page with Babel+React CDNs
  const cleaned = code
    .replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*/gm, '')
    .replace(/^export\s+default\s+/m, 'const __App = ')
    .replace(/^export\s+/gm, '')

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="${BABEL_CDN}"></script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet"/>
<style>
  body { font-family: system-ui, sans-serif; background: #fafaf9; padding: 16px; }
  .error-box { background: #ffe4e6; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; color: #e11d48; font-size: 12px; font-family: monospace; white-space: pre-wrap; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="react">
const { useState, useEffect, useCallback, useRef, useMemo } = React;

${cleaned}

// Try to find and render the component
function getApp() {
  if (typeof __App !== 'undefined') return __App;
  // Try to find any function that looks like a component
  return () => React.createElement('div', {className:'p-4 text-gray-500 text-sm'}, 'Component rendered — export default your component to preview it');
}

try {
  const App = getApp();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
} catch(e) {
  document.getElementById('root').innerHTML = '<div class="error-box">Render error: ' + e.message + '</div>';
}
</script>
</body></html>`
}

const LANGUAGE_NOTES = {
  python: { icon: '🐍', msg: 'Python runs server-side', hint: 'Copy code → run in your terminal or on replit.com' },
  java: { icon: '☕', msg: 'Java needs a JVM to run', hint: 'Copy code → compile with javac or run on replit.com' },
  cpp: { icon: '⚙️', msg: 'C++ needs compilation', hint: 'Copy code → compile with g++ or run on godbolt.org' },
  rust: { icon: '🦀', msg: 'Rust needs the Rust toolchain', hint: 'Copy code → run with cargo or on play.rust-lang.org' },
  go: { icon: '🔵', msg: 'Go runs server-side', hint: 'Copy code → run with go run or on go.dev/play' },
  sql: { icon: '🗄️', msg: 'SQL needs a database', hint: 'Copy code → run on sqliteonline.com or your DB client' },
  bash: { icon: '💻', msg: 'Bash runs in a terminal', hint: 'Copy code → paste in your terminal' },
  shell: { icon: '💻', msg: 'Shell script needs a terminal', hint: 'Copy code → paste in your terminal' },
  php: { icon: '🐘', msg: 'PHP runs server-side', hint: 'Copy code → run with php or on 3v4l.org' },
  kotlin: { icon: '🎯', msg: 'Kotlin needs the JVM', hint: 'Copy code → run on play.kotlinlang.org' },
  swift: { icon: '🍎', msg: 'Swift needs Xcode or a Mac', hint: 'Copy code → run on swift.godbolt.org' },
  ruby: { icon: '💎', msg: 'Ruby runs server-side', hint: 'Copy code → run with ruby or on replit.com' },
}

export default function LivePreview({ result, language }) {
  const [tab, setTab] = useState('preview')
  const [fullscreen, setFullscreen] = useState(false)
  const [key, setKey] = useState(0)
  const iframeRef = useRef(null)

  const lang = language?.toLowerCase()
  const blocks = extractCodeBlocks(result || '')
  const firstBlock = blocks[0]
  const blockLang = firstBlock?.lang?.toLowerCase() || lang
  const code = firstBlock?.code || ''

  const canPreview = PREVIEWABLE.includes(blockLang)
  const isReact = REACT_LANGS.includes(blockLang)
  const isWeb = WEB_LANGS.includes(blockLang)

  const langNote = LANGUAGE_NOTES[blockLang] || LANGUAGE_NOTES[lang]

  const htmlContent = (() => {
    if (!code) return null
    if (isReact) return buildReactPreview(code)
    if (isWeb) return buildHtmlPreview(code, blockLang)
    return null
  })()

  useEffect(() => { setKey(k => k + 1) }, [result])

  if (!result) return null

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-[200] bg-cx-bg flex flex-col' : 'mt-5'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between bg-white border border-cx-border rounded-t-2xl px-4 py-2.5 ${fullscreen ? '' : ''}`}>
        <div className="flex items-center gap-1">
          <button onClick={() => setTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all ${tab==='preview' ? 'bg-cx-indigo text-white' : 'text-cx-muted hover:bg-cx-bg'}`}>
            <Monitor size={12} /> Preview
          </button>
          <button onClick={() => setTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all ${tab==='code' ? 'bg-cx-indigo text-white' : 'text-cx-muted hover:bg-cx-bg'}`}>
            <Code2 size={12} /> Code
          </button>
        </div>
        <div className="flex items-center gap-2">
          {htmlContent && (
            <button onClick={() => setKey(k => k+1)}
              className="p-1.5 rounded-lg text-cx-faint hover:text-cx-indigo hover:bg-cx-indigo-light transition-all" title="Reload preview">
              <RefreshCw size={13} />
            </button>
          )}
          <button onClick={() => setFullscreen(v => !v)}
            className="p-1.5 rounded-lg text-cx-faint hover:text-cx-indigo hover:bg-cx-indigo-light transition-all">
            {fullscreen ? <X size={13} /> : <Maximize2 size={13} />}
          </button>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${htmlContent ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs text-cx-faint font-body">
              {htmlContent ? 'Live' : 'Preview unavailable'}
            </span>
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className={`border border-t-0 border-cx-border rounded-b-2xl overflow-hidden bg-white ${fullscreen ? 'flex-1' : 'h-[420px]'}`}>
        {tab === 'preview' ? (
          <>
            {htmlContent ? (
              <iframe
                key={key}
                ref={iframeRef}
                srcDoc={htmlContent}
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full border-0"
                title="Code preview"
              />
            ) : langNote ? (
              // Language-specific helpful message
              <div className="flex flex-col items-center justify-center h-full gap-5 p-8">
                <div className="text-4xl">{langNote.icon}</div>
                <div className="text-center max-w-sm">
                  <p className="font-display font-bold text-cx-text mb-2">{langNote.msg}</p>
                  <p className="text-cx-muted text-sm font-body mb-4">{langNote.hint}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <a href="https://replit.com" target="_blank" rel="noopener noreferrer"
                      className="btn-secondary text-xs py-1.5 px-3">Run on Replit ↗</a>
                    {blockLang === 'rust' && <a href="https://play.rust-lang.org" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-3">Rust Playground ↗</a>}
                    {blockLang === 'go' && <a href="https://go.dev/play" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-3">Go Playground ↗</a>}
                    {(blockLang === 'python') && <a href="https://colab.research.google.com" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-3">Google Colab ↗</a>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                <div className="w-12 h-12 bg-cx-indigo-light rounded-2xl flex items-center justify-center">
                  <Monitor size={22} className="text-cx-indigo-mid" />
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-cx-text mb-1">No preview available</p>
                  <p className="text-cx-muted text-sm font-body">Generate HTML, CSS, JavaScript or React code to see a live preview</p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Code tab — show raw code nicely
          <div className="h-full overflow-auto bg-stone-50 p-4">
            <pre className="text-xs font-mono text-cx-sub leading-relaxed whitespace-pre-wrap">{code || result}</pre>
          </div>
        )}
      </div>

      {/* React note */}
      {isReact && htmlContent && (
        <p className="text-xs text-cx-faint font-body mt-1.5 flex items-center gap-1">
          <AlertCircle size={11} /> React is transpiled by Babel in the browser. Complex imports may not resolve.
        </p>
      )}
    </div>
  )
}
