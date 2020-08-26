export const useCache = ({ fn, limit = 30, sortFn, sort = ['id'] }) => {
  const cache = (data, event) => {
    if (!Array.isArray(data)) {
      data = [data]
    }
    if (data.length) {
      if (sortFn) {
        data.sort(sortFn)
      } else {
        data.sort((a, b) => {
          if (a[sort[0]] < b[sort[0]]) return sort?.[1] === 'reverse' ? 1 : -1
          return sort?.[1] === 'reverse' ? -1 : 1
        })
      }
    }
    fn({ data: data.map((item) => (item?.id ? item.id : item)), limit, event })
  }

  return cache
}
