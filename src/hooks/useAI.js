import { useState, useCallback } from 'react'
import { saveToHistory } from '../services/aiService'

export function useAI(apiFn, toolName) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true); setError(null); setResult(null)
    try {
      const output = await apiFn(...args)
      setResult(output)
      const inp = typeof args[0] === 'string' ? args[0] : JSON.stringify(args[0])
      saveToHistory(toolName, inp, typeof output === 'string' ? output : JSON.stringify(output))
      return output
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiFn, toolName])

  const reset = useCallback(() => { setResult(null); setError(null) }, [])
  return { loading, result, error, execute, reset }
}
