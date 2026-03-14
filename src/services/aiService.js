const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

function getApiKey() {
  return import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('cx_api_key') || ''
}

export function hasEnvKey() {
  const k = import.meta.env.VITE_GROQ_API_KEY
  return !!(k && k !== 'gsk_your_key_here' && k.startsWith('gsk_'))
}

// ── Get current logged-in user's UID ─────────────────────────────────────────
function getCurrentUID() {
  try {
    const user = JSON.parse(localStorage.getItem('cx_user') || '{}')
    return user.uid || 'guest'
  } catch {
    return 'guest'
  }
}

// ── User-specific storage keys ────────────────────────────────────────────────
function historyKey() { return `cx_history_${getCurrentUID()}` }
function snippetsKey() { return `cx_snippets_${getCurrentUID()}` }

async function callGroq(systemPrompt, userMessage) {
  const apiKey = getApiKey()
  if (!apiKey || apiKey === 'gsk_your_key_here') {
    throw new Error('API key not configured. Add your Groq key in Settings.')
  }
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API Error: ${response.status}`)
  }
  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'No response received.'
}

export async function generateCode(prompt, language) {
  const system = `You are an expert senior developer. Generate clean, production-ready, well-commented ${language} code.
Always wrap code in markdown code blocks. After code, provide a concise explanation.
For HTML/CSS/JS, generate complete, self-contained code that runs in a browser.
Format:
\`\`\`${language}
// code here
\`\`\`
**What this does:** brief summary
**Key points:**
- point 1`
  return callGroq(system, `Generate ${language} code for: ${prompt}`)
}

export async function checkCode(code, language) {
  const system = `You are a senior code reviewer. Analyze code and return ONLY valid JSON (no markdown):
{"score":85,"summary":"Brief assessment","errors":[{"line":3,"severity":"error|warning|info","message":"...","fix":"..."}],"security":[{"issue":"...","description":"...","fix":"..."}],"performance":[{"issue":"...","description":"...","suggestion":"..."}],"style":[{"issue":"...","description":"..."}],"positives":["..."]}`
  const raw = await callGroq(system, `Analyze this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``)
  const cleaned = raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()
  try { return JSON.parse(cleaned) }
  catch { return { score:0, summary:raw, errors:[], security:[], performance:[], style:[], positives:[] } }
}

export async function fixCode(code, language, issues) {
  const system = `You are a senior developer. Fix all issues. Return ONLY fixed code in a code block, then changelog.
Format:
\`\`\`${language}
// fixed code
\`\`\`
**Changes made:**
- Fixed: issue 1`
  const issueList = issues.map(i=>`- ${i.message||i.issue||i}`).join('\n')
  return callGroq(system, `Fix this ${language} code.\nIssues:\n${issueList}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``)
}

export async function explainCode(code, language) {
  const system = `You are a great coding teacher. Explain clearly.
**Overview** — 1-2 sentences
**Step-by-step** — numbered steps
**Key concepts** — important ideas
**Watch out for** — edge cases
**Best used when** — use cases`
  return callGroq(system, `Explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``)
}

export async function convertCode(code, fromLang, toLang) {
  const system = `Convert code accurately between languages. Preserve logic.
\`\`\`${toLang}
// converted
\`\`\`
**Conversion notes:**
- differences or libraries needed`
  return callGroq(system, `Convert from ${fromLang} to ${toLang}:\n\`\`\`${fromLang}\n${code}\n\`\`\``)
}

export async function optimizeCode(code, language) {
  const system = `Optimize for performance, readability, best practices.
**Problems found:**
- issue
**Optimized code:**
\`\`\`${language}
// optimized
\`\`\`
**Changes & why:**
- change: reason`
  return callGroq(system, `Optimize this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``)
}

export async function debugCode(error, code, language) {
  const system = `Expert debugger.
**Root cause:** why it happened
**Fixed code:**
\`\`\`${language}
// fixed
\`\`\`
**Explanation:** step by step
**Prevention:** how to avoid`
  return callGroq(system, `Error: "${error}"\nCode:\n\`\`\`${language}\n${code}\n\`\`\``)
}

export async function analyzeRepo(repoUrl) {
  const system = `GitHub repository analyst.
**Repository:** name
**Tech Stack:** inferred
**Architecture:** patterns
**Recommendations:**
- rec
**Security checklist:**
- [ ] item
**Performance tips:**
- tip`
  return callGroq(system, `Analyze: ${repoUrl}`)
}

// ── History — per user ────────────────────────────────────────────────────────
export function saveToHistory(tool, input, output) {
  const key = historyKey()
  const h = JSON.parse(localStorage.getItem(key) || '[]')
  h.unshift({
    id: Date.now().toString(),
    tool,
    input: input.substring(0, 200),
    output: output.substring(0, 500),
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem(key, JSON.stringify(h.slice(0, 50)))
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(historyKey()) || '[]')
}

export function clearHistory() {
  localStorage.setItem(historyKey(), '[]')
}
