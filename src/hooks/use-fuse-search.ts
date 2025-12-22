import type * as FuseType from "fuse.js"
import Fuse from "fuse.js"
import { useMemo } from "react"

interface UseFuseSearchProps<T> {
  data: T[]
  search: string
  keys: FuseType.FuseOptionKey<T>[]
  options?: Omit<FuseType.IFuseOptions<T>, "keys">
}

export function useFuseSearch<T>({
  data,
  search,
  keys,
  options,
}: UseFuseSearchProps<T>) {
  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
      ...options,
    })
  }, [data, keys, options])

  const results = useMemo(() => {
    if (!search) return data
    return fuse.search(search).map(r => r.item)
  }, [search, fuse, data])

  return { results }
}
