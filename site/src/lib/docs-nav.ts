export interface DocEntry {
  slug: string
  title: string
}

export interface DocGroup {
  title: string
  items: DocEntry[]
}

export const docsNav: DocGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { slug: 'introduction', title: 'Introduction' },
      { slug: 'installation', title: 'Installation' },
      { slug: 'quickstart', title: 'Quickstart' },
    ],
  },
  {
    title: 'Laravel',
    items: [
      { slug: 'configuration', title: 'Configuration' },
      { slug: 'locale-switching', title: 'Locale switching & sessions' },
      { slug: 'translation-groups', title: 'Translation groups' },
      { slug: 'i18n-prop', title: 'The i18n shared prop' },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { slug: 'react-adapter', title: 'React adapter' },
      { slug: 'vue-adapter', title: 'Vue adapter' },
      { slug: 'interpolation', title: 'Interpolation' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { slug: 'api-reference', title: 'API reference' },
      { slug: 'troubleshooting', title: 'Troubleshooting' },
      { slug: 'compatibility', title: 'Compatibility' },
    ],
  },
]

export const flatDocsNav: DocEntry[] = docsNav.flatMap((group) => group.items)

export function findDocIndex(slug: string): number {
  return flatDocsNav.findIndex((entry) => entry.slug === slug)
}

export function adjacentDocs(slug: string): {
  prev: DocEntry | null
  next: DocEntry | null
} {
  const index = findDocIndex(slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? flatDocsNav[index - 1] : null,
    next: index < flatDocsNav.length - 1 ? flatDocsNav[index + 1] : null,
  }
}

export function groupForSlug(slug: string): DocGroup | undefined {
  return docsNav.find((group) => group.items.some((item) => item.slug === slug))
}
