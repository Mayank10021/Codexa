export const getSnippets = () => JSON.parse(localStorage.getItem('cx_snippets') || '[]')

export function saveSnippet(s) {
  const snippets = getSnippets()
  const n = { id: Date.now().toString(), ...s, favorite: false, createdAt: new Date().toISOString() }
  snippets.unshift(n)
  localStorage.setItem('cx_snippets', JSON.stringify(snippets))
  return n
}

export function updateSnippet(id, updates) {
  const snippets = getSnippets()
  const i = snippets.findIndex(s => s.id === id)
  if (i > -1) { snippets[i] = { ...snippets[i], ...updates }; localStorage.setItem('cx_snippets', JSON.stringify(snippets)) }
  return snippets
}

export function deleteSnippet(id) {
  const s = getSnippets().filter(s => s.id !== id)
  localStorage.setItem('cx_snippets', JSON.stringify(s)); return s
}

export function toggleFavorite(id) {
  const snippets = getSnippets()
  const i = snippets.findIndex(s => s.id === id)
  if (i > -1) { snippets[i].favorite = !snippets[i].favorite; localStorage.setItem('cx_snippets', JSON.stringify(snippets)) }
  return snippets
}

export function seedSnippets() {
  if (getSnippets().length > 0) return
  const examples = [
    { title: 'React Login Form', language: 'jsx', tags: ['react','form','auth'], description: 'Reusable login form with loading state',
      code: `import { useState } from 'react';\n\nexport default function LoginForm({ onLogin }) {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [loading, setLoading] = useState(false);\n\n  const handleSubmit = async (e) => {\n    e.preventDefault();\n    setLoading(true);\n    try { await onLogin({ email, password }); }\n    finally { setLoading(false); }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />\n      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />\n      <button type="submit" disabled={loading}>\n        {loading ? 'Loading...' : 'Login'}\n      </button>\n    </form>\n  );\n}` },
    { title: 'Express API Template', language: 'javascript', tags: ['express','api','node'], description: 'Basic REST route with error handling',
      code: `const express = require('express');\nconst router = express.Router();\n\nrouter.get('/', async (req, res) => {\n  try {\n    const items = await Item.find();\n    res.json({ success: true, data: items });\n  } catch (err) {\n    res.status(500).json({ success: false, error: err.message });\n  }\n});\n\nrouter.post('/', async (req, res) => {\n  try {\n    const item = new Item(req.body);\n    await item.save();\n    res.status(201).json({ success: true, data: item });\n  } catch (err) {\n    res.status(400).json({ success: false, error: err.message });\n  }\n});\n\nmodule.exports = router;` },
    { title: 'MongoDB Connection', language: 'javascript', tags: ['mongodb','mongoose'], description: 'Mongoose connect with error handling',
      code: `const mongoose = require('mongoose');\n\nconst connectDB = async () => {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI);\n    console.log(\`MongoDB Connected: \${conn.connection.host}\`);\n  } catch (err) {\n    console.error(err.message);\n    process.exit(1);\n  }\n};\n\nmodule.exports = connectDB;` },
    { title: 'Fetch with Timeout', language: 'javascript', tags: ['fetch','async','http'], description: 'Robust fetch wrapper with timeout and error handling',
      code: `async function fetchData(url, options = {}) {\n  const controller = new AbortController();\n  const timeout = setTimeout(() => controller.abort(), 10000);\n  try {\n    const response = await fetch(url, { ...options, signal: controller.signal });\n    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n    return await response.json();\n  } catch (err) {\n    if (err.name === 'AbortError') throw new Error('Request timed out');\n    throw err;\n  } finally {\n    clearTimeout(timeout);\n  }\n}` },
  ]
  examples.forEach(e => saveSnippet(e))
}
