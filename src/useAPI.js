import debounce from 'lodash.debounce'
import { useCallback, useState } from 'react'

export const useAPI = ({ apiFn, debounceTime = 300, reset }) => {
  const [results, setResults] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    debounce(async (data) => {
      try {
        setLoading(true)
        const {data:res} = await apiFn(data)
        setResults(res)
        setLoading(false)
        reset()
      } catch (error_) {
        setResults(null)
        setError(error_?.response || 'No Internet Connection!')
        setLoading(false)
      }
    }, debounceTime),
    []
  )

  return {
    onSubmit,
    results,
    apiError: error,
    loading
  }
}
