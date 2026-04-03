import { useState, useEffect, useCallback, useRef } from 'react'

export default function useApi(apiFn, params = null, options = {}) {
  const { enabled = true } = options
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const paramsRef = useRef(JSON.stringify(params))

  const fetch = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const result = await apiFn(params)
      setData(result.data)
      setMeta(result.meta)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [apiFn, enabled, JSON.stringify(params)])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, meta, loading, error, refetch: fetch }
}
