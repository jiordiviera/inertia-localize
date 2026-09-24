import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const location = useLocation()
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    // Headings come from the MDX article rendered by a sibling route component,
    // so reading the DOM after each navigation is the only way to know what's on the page.
    const article = document.getElementById("doc-content")
    if (!article) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeadings([])
      return
    }
    const nodes = Array.from(article.querySelectorAll("h2, h3"))
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent ?? "",
        level: node.tagName === "H3" ? 3 : 2,
      }))
    )
  }, [location.pathname])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="flex w-[220px] shrink-0 flex-col gap-2 border-l border-border pl-6 text-[13px]"
    >
      <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
        On this page
      </span>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
          style={{ paddingLeft: heading.level === 3 ? 12 : 0 }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}
