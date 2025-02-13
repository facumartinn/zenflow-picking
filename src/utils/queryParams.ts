export type QueryParams = Record<string, string | number | number[] | null | undefined>

export function objectToQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, item.toString())
        }
      })
    } else {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams.toString()
}

export const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
