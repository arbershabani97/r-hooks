import debounce from 'lodash.debounce'
import uniq from 'lodash.uniq'
import { useCallback, useState } from 'react'

let paginationResponse = {
  currentPage: 'meta.currentPage',
  lastPage: 'meta.lastPage',
  perPage: 'meta.perPage'
}

export const setupUsePagination = (data) =>
  (paginationResponse = data || paginationResponse)

const getSelectedAttributes = (response, data) => {
  let result
  data.split('.').forEach((attr) => {
    result = result ? result[attr] : response[attr]
  })
  return result
}
const getPagination = (response, loaded = [], reset = false) => {
  const currentPage = getSelectedAttributes(
    response,
    paginationResponse.currentPage
  )
  const lastPage = getSelectedAttributes(response, paginationResponse.lastPage)
  const perPage = getSelectedAttributes(response, paginationResponse.perPage)
  return {
    current: currentPage || 1,
    last: lastPage || 1,
    perPage: perPage || 20,
    hasMore: lastPage > currentPage,
    loaded: reset ? [currentPage] : uniq([...loaded, currentPage])
  }
}

export const usePaginationAPI = ({ apiFn, debounceTime = 500, logger }) => {
  const [pages, setPages] = useState({
    current: 0,
    last: 0,
    loaded: [],
    perPage: 0,
    hasMore: false
  })

  const [response, setResponse] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleFetch = useCallback(
    // eslint-disable-next-line max-statements
    debounce(async (data, reset) => {
      try {
        setLoading(true)
        if (pages.loaded.includes(data.page) && !reset) return
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

        const _pages = getPagination(res, pages.loaded, reset)
        setError(false)
        setPages(_pages)
        setResponse(res)
      } catch (error_) {
        if (error_?.response?.status === 304) {
          setPages((_pages) => ({
            ..._pages,
            perPage: data?.perPage || 20,
            current: data.page,
            loaded: [data.page, ..._pages.loaded],
            hasMore: true
          }))
        }
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
      } finally {
        setLoading(false)
      }
    }, debounceTime)
  )

  return {
    handleFetch,
    response,
    apiError: error,
    pages,
    loading
  }
}
