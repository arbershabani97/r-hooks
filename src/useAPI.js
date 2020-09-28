import debounce from 'lodash.debounce'
import { useCallback, useState } from 'react'

export const useAPI = ({ apiFn, debounceTime = 300, reset, logger }) => {
  const [response, setResponse] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const apiCall = useCallback(
    debounce(async (data) => {
      try {
        setLoading(true)
        if (logger)
          console.log(
            `%cRequest %c${apiFn.name}`,
            'color: orange; font-weight: bold;',
            'color: blue; font-weight: bold;',
            data
          )
        const { data: res } = await apiFn(data)
        if (logger)
          console.log(
            `%cSuccess %c${apiFn.name}`,
            'color: green; font-weight: bold;',
            'color: blue; font-weight: bold;',
            res
          )
        setResponse(res)
        setLoading(false)
        reset()
      } catch (error_) {
        setResponse(null)
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

  return {
    apiCall,
    response,
    apiError: error,
    loading
  }
}
