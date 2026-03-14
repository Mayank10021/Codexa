export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea')
    ta.value = text; document.body.appendChild(ta); ta.select()
    document.execCommand('copy'); document.body.removeChild(ta)
  })
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export function extractCodeBlocks(markdown) {
  const blocks = []
  const regex = /```(\w+)?\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(markdown)) !== null)
    blocks.push({ lang: match[1] || 'text', code: match[2].trim() })
  return blocks
}

export function extractFirstCodeBlock(markdown) {
  return extractCodeBlocks(markdown)[0] || null
}

export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function langExtension(lang) {
  const map = { javascript:'js', typescript:'ts', python:'py', java:'java', cpp:'cpp', c:'c', go:'go', rust:'rs', php:'php', ruby:'rb', swift:'swift', kotlin:'kt', html:'html', css:'css', jsx:'jsx', tsx:'tsx', sql:'sql', bash:'sh', shell:'sh', json:'json' }
  return map[lang?.toLowerCase()] || 'txt'
}

export const LANGUAGES = [
  'JavaScript','TypeScript','Python','Java','C++','C','Go',
  'Rust','PHP','Ruby','Swift','Kotlin','JSX','TSX',
  'HTML','CSS','SQL','Bash','JSON',
]

export function getInitials(name) {
  return name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??'
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}
