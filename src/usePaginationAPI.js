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

export const usePaginationAPI = ({ apiFn, debounceTime = 500 }) => {
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
        const { data: res } = await apiFn(data)

        const _pages = getPagination(res, pages.loaded, reset)
        setPages(_pages)
        setResponse(res)
      } catch (error_) {
        setError(error_?.response || 'No Internet Connection!')
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
