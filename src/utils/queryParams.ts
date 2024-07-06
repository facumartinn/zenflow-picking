export type QueryParams = Record<string, string | number | number[]>

export function objectToQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === undefined) return
    if (Array.isArray(value)) {
      value.forEach(item => {
        searchParams.append(key, item.toString())
      })
    } else {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams.toString()
}
