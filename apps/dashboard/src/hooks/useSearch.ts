import Fuse from 'fuse.js'
import { useMemo } from 'react'

export interface Opts<T> {
  items: T[]
  query?: string
}

function useSearch<T>({ query, items }: Opts<T>) {
  const fuse = useMemo(() => new Fuse(items), [items])
  const results = useMemo(() => query ? fuse.search(query).map(g => g.item) : items, [fuse, query, items])
  return results
}

export default useSearch
