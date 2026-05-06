import { useState, useCallback } from 'react'

/**
 * @template T
 * @param {(...args: any[]) => Promise<T>} fn
 */
export function useAsyncAction(fn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [success, setSuccess] = useState(null)

  const run = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      setData(null)
      try {
        const result = await fn(...args)
        setData(result)
        setSuccess('Operación realizada correctamente.')
        return result
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [fn],
  )

  const reset = useCallback(() => {
    setError(null)
    setSuccess(null)
    setData(null)
  }, [])

  return { loading, error, data, success, run, reset }
}
