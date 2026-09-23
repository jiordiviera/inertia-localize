import { NavLink, Outlet, useParams } from 'react-router-dom'
import { TableOfContents } from '@/components/site/table-of-contents'
import { docsNav, flatDocsNav, groupForSlug } from '@/lib/docs-nav'
import { cn } from '@/lib/utils'

export function DocsLayout() {
  const { slug = '' } = useParams()
  const group = groupForSlug(slug)
  const current = flatDocsNav.find((entry) => entry.slug === slug)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 px-6 text-xs text-white/45 sm:px-10">
        <div>
          Docs
          {group && (
            <>
              <span className="mx-1.5 text-white/25">/</span>
              {group.title}
            </>
          )}
          {current && (
            <>
              <span className="mx-1.5 text-white/25">/</span>
              <span className="text-white/70">{current.title}</span>
            </>
          )}
        </div>
        <a
          href={`https://github.com/jiordiviera/inertia-localize/blob/v0/site/src/content/docs/${slug}.mdx`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/15 px-2.5 py-1 hover:border-white/30"
        >
          Edit on GitHub
        </a>
      </div>

      <div className="flex flex-1">
        <aside className="hidden w-[260px] shrink-0 flex-col gap-5 overflow-y-auto border-r border-white/10 px-5 py-6 text-[13px] lg:flex">
          {docsNav.map((navGroup) => (
            <div key={navGroup.title}>
              <div className="mb-2 text-[11px] uppercase tracking-wide text-white/35">
                {navGroup.title}
              </div>
              <div className="flex flex-col">
                {navGroup.items.map((item) => (
                  <NavLink
                    key={item.slug}
                    to={`/docs/${item.slug}`}
                    className={({ isActive }) =>
                      cn(
                        '-mx-2 rounded-md px-2 py-1.5 text-white/60 transition-colors hover:text-white/85',
                        isActive && 'bg-primary/15 text-secondary',
                      )
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-x-hidden px-6 py-10 sm:px-10">
          <Outlet />
        </main>

        <div className="hidden lg:block">
          <TableOfContents />
        </div>
      </div>
    </div>
  )
}
