import { useState } from 'react'

export const useFetchAPI = ({ apiFn, data, logger }) => {
  const [response, setResponse] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const apiCall = async () => {
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
      setLoading(false)
      setResponse(res)
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
  }

  return {
    apiCall,
    response,
    apiError: error,
    loading
  }
}
