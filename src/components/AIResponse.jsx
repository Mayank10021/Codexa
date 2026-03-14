import { useState } from 'react'
import { Copy, Check, Download, ChevronDown } from 'lucide-react'
import { copyToClipboard, downloadFile, langExtension } from '../utils/helpers'
import CodeEditor from './CodeEditor'

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-cx-text">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-cx-indigo-light text-cx-indigo font-mono text-xs px-1.5 py-0.5 rounded-md">$1</code>')
    .replace(/^#{3} (.+)$/gm, '<h3 class="font-display font-bold text-base text-cx-text mt-4 mb-1.5">$1</h3>')
    .replace(/^#{2} (.+)$/gm, '<h2 class="font-display font-bold text-lg text-cx-text mt-5 mb-2">$1</h2>')
    .replace(/^#{1} (.+)$/gm, '<h1 class="font-display font-bold text-xl text-cx-text mt-5 mb-2">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="text-cx-sub text-sm ml-4 list-disc leading-relaxed">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-cx-sub text-sm ml-4 list-decimal leading-relaxed">$1</li>')
    .replace(/\[ \]/g, '<span class="inline-block w-3.5 h-3.5 border border-cx-border rounded mr-1 align-middle"></span>')
    .replace(/\[x\]/gi, '<span class="inline-block w-3.5 h-3.5 bg-cx-emerald rounded mr-1 align-middle"></span>')
    .replace(/\n/g, '<br />')
}

export default function AIResponse({ result, language='javascript', toolName='code' }) {
  const [copied, setCopied] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showAll, setShowAll] = useState(false)

  if (!result) return null

  const codeMatches = [...result.matchAll(/```(\w+)?\n([\s\S]*?)```/g)]
  const parts = result.split(/```[\s\S]*?```/)
  const allCode = codeMatches.map(m => m[2].trim()).join('\n\n')

  const handleCopyAll = () => {
    copyToClipboard(allCode || result)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyBlock = (idx, code) => {
    copyToClipboard(code)
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000)
  }

  const handleDownload = () => {
    downloadFile(allCode || result, `${toolName}.${langExtension(language)}`)
  }

  return (
    <div className="animate-fade-up space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cx-emerald animate-pulse" />
          <span className="text-sm font-semibold text-cx-sub font-body">AI Response</span>
        </div>
        <div className="flex items-center gap-2">
          {codeMatches.length > 0 && (
            <button onClick={handleDownload} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5">
              <Download size={12} /> Download
            </button>
          )}
          <button onClick={handleCopyAll} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            {copied ? <Check size={12} className="text-cx-emerald" /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {parts.map((part, i) => (
          <div key={i}>
            {part.trim() && (
              <div className="text-cx-sub text-sm leading-relaxed font-body"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(part.trim()) }} />
            )}
            {codeMatches[i] && (
              <div className="mt-3">
                <div className="code-header">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-300" />
                      <span className="w-3 h-3 rounded-full bg-amber-300" />
                      <span className="w-3 h-3 rounded-full bg-emerald-300" />
                    </div>
                    <span className="text-xs font-mono text-cx-muted">{codeMatches[i][1] || language}</span>
                  </div>
                  <button onClick={() => handleCopyBlock(i, codeMatches[i][2].trim())}
                    className="text-cx-faint hover:text-cx-indigo transition-colors flex items-center gap-1 text-xs font-body">
                    {copiedIdx === i ? <Check size={11} className="text-cx-emerald" /> : <Copy size={11} />}
                    {copiedIdx === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <CodeEditor value={codeMatches[i][2].trim()} language={codeMatches[i][1] || language}
                  height="220px" readOnly />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
