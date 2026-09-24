import { NavLink, useParams } from "react-router-dom"

import { getDocComponent } from "@/lib/docs-content"
import { adjacentDocs, flatDocsNav } from "@/lib/docs-nav"

export function DocPage() {
  const { slug = "" } = useParams()
  // Looked up from a static registry built at module load, not created here.
  const Content = getDocComponent(slug)
  const { prev, next } = adjacentDocs(slug)
  const known = flatDocsNav.some((entry) => entry.slug === slug)

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[65ch] flex-col gap-10">
      <article
        id="doc-content"
        className="prose-docs prose max-w-none prose-neutral dark:prose-invert"
      >
        {Content ? (
          // eslint-disable-next-line react-hooks/static-components
          <Content />
        ) : known ? (
          <p className="text-muted-foreground">
            This page hasn't been written yet.
          </p>
        ) : (
          <p className="text-muted-foreground">Page not found.</p>
        )}
      </article>

      {(prev || next) && (
        <div className="flex flex-col gap-3 border-t border-border pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <NavLink
              to={`/docs/${prev.slug}`}
              className="rounded-lg border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              &#8592; {prev.title}
            </NavLink>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <NavLink
              to={`/docs/${next.slug}`}
              className="rounded-lg border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:text-right"
            >
              {next.title} &#8594;
            </NavLink>
          )}
        </div>
      )}
    </div>
  )
}
