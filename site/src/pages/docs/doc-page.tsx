import { NavLink, useParams } from 'react-router-dom'
import { getDocComponent } from '@/lib/docs-content'
import { adjacentDocs, flatDocsNav } from '@/lib/docs-nav'

export function DocPage() {
  const { slug = '' } = useParams()
  const Content = getDocComponent(slug)
  const { prev, next } = adjacentDocs(slug)
  const known = flatDocsNav.some((entry) => entry.slug === slug)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <article
        id="doc-content"
        className="prose prose-invert prose-docs max-w-none"
      >
        {Content ? (
          <Content />
        ) : known ? (
          <p className="text-white/50">This page hasn't been written yet.</p>
        ) : (
          <p className="text-white/50">Page not found.</p>
        )}
      </article>

      {(prev || next) && (
        <div className="flex items-center justify-between border-t border-white/10 pt-6 text-sm">
          {prev ? (
            <NavLink
              to={`/docs/${prev.slug}`}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-white/60 transition-colors hover:border-white/25 hover:text-white/90"
            >
              &#8592; {prev.title}
            </NavLink>
          ) : (
            <span />
          )}
          {next && (
            <NavLink
              to={`/docs/${next.slug}`}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-white/60 transition-colors hover:border-white/25 hover:text-white/90"
            >
              {next.title} &#8594;
            </NavLink>
          )}
        </div>
      )}
    </div>
  )
}
