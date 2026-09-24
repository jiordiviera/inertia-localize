import fs from "node:fs"
import path from "node:path"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { defineConfig, type Plugin } from "vite"

const docsRawVirtualId = "virtual:docs-raw"
const docsRawResolvedId = "\0" + docsRawVirtualId

// Exposes the raw markdown source of every doc, keyed by slug, without ever
// routing the .mdx files back through the mdx() transform below (it matches
// by filename regardless of query string, so a plain `?raw` import would
// still come back as compiled JSX instead of the original text).
function docsRawSourcePlugin(): Plugin {
  const docsDir = path.resolve(import.meta.dirname, "src/content/docs")

  return {
    name: "docs-raw-source",
    resolveId(id) {
      if (id === docsRawVirtualId) return docsRawResolvedId
    },
    async load(id) {
      if (id !== docsRawResolvedId) return

      const files = await fs.promises.readdir(docsDir)
      const entries = await Promise.all(
        files
          .filter((file) => file.endsWith(".mdx"))
          .map(async (file) => {
            const fullPath = path.join(docsDir, file)
            this.addWatchFile(fullPath)
            const source = await fs.promises.readFile(fullPath, "utf8")
            return [file.replace(/\.mdx$/, ""), source] as const
          })
      )

      return `export default ${JSON.stringify(Object.fromEntries(entries))}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            { theme: "github-dark-dimmed", keepBackground: false },
          ],
        ],
        providerImportSource: "@mdx-js/react",
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    tailwindcss(),
    docsRawSourcePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
