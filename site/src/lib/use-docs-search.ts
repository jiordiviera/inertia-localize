import { useEffect, useRef, useState } from 'react'

export interface SearchResult {
  id: string
  url: string
  title: string
  excerpt: string
}

interface PagefindResult {
  id: string
  data: () => Promise<{
    url: string
    meta: { title?: string }
    excerpt: string
  }>
}

interface PagefindApi {
  search: (query: string) => Promise<{ results: PagefindResult[] }>
}

declare global {
  interface Window {
    __pagefind?: PagefindApi
  }
}

async function loadPagefind(): Promise<PagefindApi | null> {
  if (window.__pagefind) return window.__pagefind
  try {
    // Built from parts so Vite's dev/build import-analysis never tries to statically
    // resolve this path — the file only exists after `pagefind --site dist` runs.
    const pagefindPath = ['', 'pagefind', 'pagefind.js'].join('/')
    const mod = await import(/* @vite-ignore */ pagefindPath)
    const pagefind = mod as unknown as PagefindApi
    window.__pagefind = pagefind
    return pagefind
  } catch {
    return null
  }
}

/**
 * Uses the Pagefind static index generated at build time (`pagefind --site dist`).
 * Falls back to `null` results when the index isn't present, e.g. in dev.
 */
export function useDocsSearch(query: string) {
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [ready, setReady] = useState(false)
  const pagefindRef = useRef<PagefindApi | null>(null)

  useEffect(() => {
    loadPagefind().then((api) => {
      pagefindRef.current = api
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (!ready || !query.trim()) {
      setResults(null)
      return
    }

    let cancelled = false
    const api = pagefindRef.current
    if (!api) {
      setResults(null)
      return
    }

    api.search(query).then(async (search) => {
      const entries = await Promise.all(
        search.results.slice(0, 8).map(async (result) => {
          const data = await result.data()
          return {
            id: result.id,
            url: data.url,
            title: data.meta.title ?? data.url,
            excerpt: data.excerpt,
          }
        }),
      )
      if (!cancelled) setResults(entries)
    })

    return () => {
      cancelled = true
    }
  }, [query, ready])

  return { results, indexed: ready && pagefindRef.current !== null }
}
