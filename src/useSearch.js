import debounce from 'lodash.debounce'
import { useCallback, useState } from 'react'

export const useSearch = ({ apiFn, debounceTime = 700, logger }) => {
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
        if (logger)
          console.log(
            `%cRequest %c${apiFn.name}`,
            'color: orange; font-weight: bold;',
            'color: blue; font-weight: bold;',
            params
          )
        const { data } = await apiFn(params)
        if (logger)
          console.log(
            `%cSuccess %c${apiFn.name}`,
            'color: green; font-weight: bold;',
            'color: blue; font-weight: bold;',
            data
          )
        setLoading(false)
        setResults(data)
      } catch (error_) {
        const errorMessage = String(error_).includes('Network Error')
          ? 'No Internet Connection!'
          : error_?.response || error_
        if (logger)
          console.log(
            `%cError %c${apiFn.name}`,
            'color: red; font-weight: bold;',
            'color: blue; font-weight: bold;',
            errorMessage
          )
        setError(errorMessage)
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
