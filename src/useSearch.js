import debounce from 'lodash.debounce'
import { useCallback, useState } from 'react'

export const useSearch = ({ apiFn, debounceTime = 700 }) => {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(async (value, params) => {
      try {
        if (!value) {
          setResults([])
          return
        }
        setLoading(true)
        const { data } = await apiFn(params)
        setLoading(false)
        setResults(data)
      } catch (error_) {
        setError(error_?.response || 'No Internet Connection!')
        setLoading(false)
      }
    }, debounceTime),
    []
  )

  const handleChange = (e, params) => {
    const { value } = e.target
    setSearchValue(value)
    handleSearch(value, params)
  }

  return {
    searchValue,
    results,
    handleChange,
    apiError: error,
    loading
  }
}
