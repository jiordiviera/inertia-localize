import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const location = useLocation()
  const [headings, setHeadings] = useState<Heading[]>([])

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-scan headings after client-side route changes
  useEffect(() => {
    const article = document.getElementById('doc-content')
    if (!article) {
      setHeadings([])
      return
    }
    const nodes = Array.from(article.querySelectorAll('h2, h3'))
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent ?? '',
        level: node.tagName === 'H3' ? 3 : 2,
      })),
    )
  }, [location.pathname])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="flex w-[220px] shrink-0 flex-col gap-2 border-l border-white/10 px-5 py-6 text-[13px]"
    >
      <span className="text-[11px] uppercase tracking-wide text-white/35">
        On this page
      </span>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className="text-white/55 transition-colors hover:text-secondary"
          style={{ paddingLeft: heading.level === 3 ? 12 : 0 }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}
