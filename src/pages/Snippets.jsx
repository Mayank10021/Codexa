import { useState, useEffect } from 'react'
import { BookMarked, Plus, Search, Trash2, Edit2, Star, Copy, Check, X, Save, ChevronDown } from 'lucide-react'
import CodeEditor from '../components/CodeEditor'
import { getSnippets, saveSnippet, updateSnippet, deleteSnippet, toggleFavorite, seedSnippets } from '../services/snippetService'
import { copyToClipboard, LANGUAGES, formatDate } from '../utils/helpers'

function Modal({ snippet, onClose, onSave }) {
  const [title, setTitle] = useState(snippet?.title || '')
  const [language, setLanguage] = useState(snippet?.language || 'JavaScript')
  const [code, setCode] = useState(snippet?.code || '')
  const [description, setDescription] = useState(snippet?.description || '')
  const [tagInput, setTagInput] = useState(snippet?.tags?.join(', ') || '')

  const handleSave = () => {
    if (!title.trim() || !code.trim()) return
    const tags = tagInput.split(',').map(t=>t.trim()).filter(Boolean)
    onSave({ title, language, code, description, tags }); onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl border border-cx-border shadow-lift p-6 max-h-[90vh] overflow-y-auto animate-bounce-soft">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-cx-text">{snippet ? 'Edit snippet' : 'New snippet'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cx-bg transition-colors text-cx-faint"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="e.g. React useEffect cleanup" />
            </div>
            <div>
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
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="input-field" placeholder="Brief description..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Tags (comma separated)</label>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} className="input-field" placeholder="react, hooks, auth" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cx-sub mb-1.5 font-body">Code *</label>
            <CodeEditor value={code} onChange={setCode} language={language} height="250px" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={!title.trim() || !code.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={14} /> Save snippet
          </button>
        </div>
      </div>
    </div>
  )
}

function SnippetCard({ snippet, onEdit, onDelete, onToggleFav }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const handleCopy = () => { copyToClipboard(snippet.code); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  const lines = snippet.code.split('\n').length

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-sm text-cx-text truncate">{snippet.title}</h3>
          {snippet.description && <p className="text-cx-faint text-xs font-body mt-0.5 truncate">{snippet.description}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onToggleFav(snippet.id)} className={`p-1.5 rounded-lg transition-all ${snippet.favorite ? 'text-cx-amber bg-amber-50' : 'text-cx-faint hover:text-cx-amber hover:bg-amber-50'}`}>
            <Star size={13} fill={snippet.favorite?'currentColor':'none'} />
          </button>
          <button onClick={handleCopy} className="p-1.5 rounded-lg text-cx-faint hover:text-cx-emerald hover:bg-emerald-50 transition-all">
            {copied ? <Check size={13} className="text-cx-emerald" /> : <Copy size={13} />}
          </button>
          <button onClick={() => onEdit(snippet)} className="p-1.5 rounded-lg text-cx-faint hover:text-cx-indigo hover:bg-cx-indigo-light transition-all">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(snippet.id)} className="p-1.5 rounded-lg text-cx-faint hover:text-cx-rose hover:bg-rose-50 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="badge-gray">{snippet.language}</span>
        {snippet.tags?.map(t => <span key={t} className="badge-indigo">{t}</span>)}
      </div>

      <div className={`relative bg-stone-50 rounded-xl border border-cx-border overflow-hidden transition-all ${expanded ? '' : 'max-h-20'}`}>
        <pre className="p-3 text-xs font-mono text-cx-muted overflow-x-auto leading-relaxed whitespace-pre-wrap">{snippet.code}</pre>
        {!expanded && lines > 4 && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none" />}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-cx-faint text-xs font-body">{formatDate(snippet.createdAt)}</span>
        {lines > 4 && (
          <button onClick={() => setExpanded(v=>!v)} className="text-cx-faint hover:text-cx-indigo text-xs font-body font-medium flex items-center gap-1 transition-colors">
            {expanded ? 'Collapse' : 'Expand'}
            <ChevronDown size={11} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Snippets() {
  const [snippets, setSnippets] = useState([])
  const [search, setSearch] = useState('')
  const [filterLang, setFilterLang] = useState('All')
  const [filterFav, setFilterFav] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editSnippet, setEditSnippet] = useState(null)

  useEffect(() => { seedSnippets(); setSnippets(getSnippets()) }, [])
  const refresh = () => setSnippets(getSnippets())

  const handleSave = (data) => {
    editSnippet ? updateSnippet(editSnippet.id, data) : saveSnippet(data)
    setEditSnippet(null); refresh()
  }
  const handleDelete = (id) => { if (confirm('Delete this snippet?')) { deleteSnippet(id); refresh() } }
  const handleEdit = (s) => { setEditSnippet(s); setModalOpen(true) }
  const handleToggleFav = (id) => { toggleFavorite(id); refresh() }

  const languages = ['All', ...new Set(snippets.map(s=>s.language))]
  const filtered = snippets.filter(s => {
    const ms = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.tags?.some(t=>t.toLowerCase().includes(search.toLowerCase()))
    const ml = filterLang === 'All' || s.language === filterLang
    const mf = !filterFav || s.favorite
    return ms && ml && mf
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center">
            <BookMarked size={18} className="text-cx-emerald" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-cx-text">Snippet Library</h1>
            <p className="text-cx-muted text-sm font-body">{snippets.length} snippets saved</p>
          </div>
        </div>
        <button onClick={() => { setEditSnippet(null); setModalOpen(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> New snippet
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cx-faint" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search snippets..." className="input-field pl-9 text-sm" />
        </div>
        <div className="relative">
          <select value={filterLang} onChange={e => setFilterLang(e.target.value)} className="select-field appearance-none pr-8 text-sm">
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-cx-faint pointer-events-none" />
        </div>
        <button onClick={() => setFilterFav(v=>!v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body font-medium transition-all ${filterFav ? 'bg-amber-50 border-amber-200 text-cx-amber' : 'bg-white border-cx-border text-cx-muted hover:border-amber-200'}`}>
          <Star size={13} fill={filterFav?'currentColor':'none'} /> Favorites
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <BookMarked size={28} className="text-cx-faint mx-auto mb-3" />
          <p className="text-cx-muted font-body text-sm">{search || filterFav ? 'No snippets match your filters' : 'No snippets yet'}</p>
          <button onClick={() => { setEditSnippet(null); setModalOpen(true) }} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus size={15} /> Create your first snippet
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => <SnippetCard key={s.id} snippet={s} onEdit={handleEdit} onDelete={handleDelete} onToggleFav={handleToggleFav} />)}
        </div>
      )}

      {modalOpen && <Modal snippet={editSnippet} onClose={() => { setModalOpen(false); setEditSnippet(null) }} onSave={handleSave} />}
    </div>
  )
}
