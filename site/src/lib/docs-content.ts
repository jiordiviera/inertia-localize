import type { ComponentType } from "react"
import docsRaw from "virtual:docs-raw"

const modules = import.meta.glob("/src/content/docs/*.mdx", {
  eager: true,
}) as Record<string, { default: ComponentType }>

const bySlug = new Map<string, ComponentType>()

for (const [path, mod] of Object.entries(modules)) {
  const slug = path
    .split("/")
    .pop()
    ?.replace(/\.mdx$/, "")
  if (slug) bySlug.set(slug, mod.default)
}

export function getDocComponent(slug: string): ComponentType | undefined {
  return bySlug.get(slug)
}

export function getDocSource(slug: string): string | undefined {
  return docsRaw[slug]
}
