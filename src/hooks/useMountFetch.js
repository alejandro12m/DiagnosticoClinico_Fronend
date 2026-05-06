import { useEffect } from 'react'
import { useAsyncAction } from './useAsyncAction'

export function useMountFetch(fetcher) {
  const state = useAsyncAction(fetcher)
  useEffect(() => {
    state.run().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carga inicial única
  }, [])
  return { ...state, reload: () => state.run().catch(() => {}) }
}
