import { MDXProvider } from "@mdx-js/react"
import { NavLink, Outlet, useParams } from "react-router-dom"

import { CodeBlock } from "@/components/site/code-block"
import { DocPageActions } from "@/components/site/doc-page-actions"
import { TableOfContents } from "@/components/site/table-of-contents"
import { docsNav, flatDocsNav, groupForSlug } from "@/lib/docs-nav"
import { cn } from "@/lib/utils"

const mdxComponents = { pre: CodeBlock }

export function DocsLayout() {
  const { slug = "" } = useParams()
  const group = groupForSlug(slug)
  const current = flatDocsNav.find((entry) => entry.slug === slug)

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border">
        <div className="mx-auto flex h-11 max-w-6xl items-center justify-between px-6 text-xs text-muted-foreground">
          <div>
            Docs
            {group && (
              <>
                <span className="mx-1.5 text-current/30">/</span>
                {group.title}
              </>
            )}
            {current && (
              <>
                <span className="mx-1.5 text-current/30">/</span>
                <span className="text-foreground">{current.title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DocPageActions slug={slug} />
            <a
              href={`https://github.com/jiordiviera/inertia-locale-kit/blob/v0/site/src/content/docs/${slug}.mdx`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-border px-2.5 py-1 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Edit on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6">
        <aside className="hidden w-[260px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-border py-10 pr-6 text-[13px] lg:flex">
          {docsNav.map((navGroup) => (
            <div key={navGroup.title}>
              <div className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {navGroup.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {navGroup.items.map((item) => (
                  <NavLink
                    key={item.slug}
                    to={`/docs/${item.slug}`}
                    className={({ isActive }) =>
                      cn(
                        "-mx-2 rounded-md border-l-2 border-transparent px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground",
                        isActive &&
                          "border-primary bg-primary/10 font-medium text-primary"
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

        <main className="flex-1 overflow-x-hidden px-6 py-10 lg:px-10">
          <MDXProvider components={mdxComponents}>
            <Outlet />
          </MDXProvider>
        </main>

        <div className="hidden shrink-0 lg:block lg:py-10">
          <TableOfContents />
        </div>
      </div>
    </div>
  )
}
