# Inertia Localize — docs site

Public documentation site for Inertia Localize. Vite + React, content in MDX, prerendered per
route so Pagefind can index full-text search.

## Development

```sh
pnpm --dir site dev
```

## Build

```sh
pnpm --dir site build
```

Runs, in order: type-check, client build, an SSR build used only to prerender, `prerender.mjs`
(writes static HTML per route into `dist/`, then discards the SSR build), and `pagefind` (builds
the search index into `dist/pagefind`). The result in `dist/` is fully static.

## Adding a doc page

1. Add the page to the relevant group in `src/lib/docs-nav.ts`.
2. Add `src/content/docs/<slug>.mdx` with the same slug.

Sidebar order, breadcrumbs, and prev/next pagination all follow `docs-nav.ts`.
