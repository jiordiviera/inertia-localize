import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const docsDir = join(root, "src/content/docs")
const publicDir = join(root, "public")

const SITE_URL = "https://inertia-localize.jiordiviera.me"
const SITE_NAME = "inertia-localize"
const SITE_SUMMARY =
  "Laravel-first localization toolkit for Inertia apps. Laravel stays the source of truth for locales and translations; React and Vue adapters consume them through a small useTranslation() hook."

// Mirrors src/lib/docs-nav.ts — keep in sync when docs are added or reordered.
const docsNav = [
  {
    title: "Getting Started",
    items: ["introduction", "installation", "quickstart"],
  },
  {
    title: "Laravel",
    items: [
      "configuration",
      "locale-switching",
      "translation-groups",
      "i18n-prop",
    ],
  },
  {
    title: "Frontend",
    items: ["react-adapter", "vue-adapter", "interpolation"],
  },
  {
    title: "Reference",
    items: ["api-reference", "troubleshooting", "compatibility"],
  },
]

function readDoc(slug) {
  const source = readFileSync(join(docsDir, `${slug}.mdx`), "utf8")
  const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug
  const firstParagraph = source
    .split("\n\n")
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#"))
  const description = firstParagraph?.replace(/\s+/g, " ").slice(0, 180) ?? ""
  return { slug, title, description, source }
}

let index = `# ${SITE_NAME}\n\n> ${SITE_SUMMARY}\n\n`
let full = `# ${SITE_NAME}\n\n> ${SITE_SUMMARY}\n\n`

for (const group of docsNav) {
  index += `## ${group.title}\n\n`
  for (const slug of group.items) {
    const doc = readDoc(slug)
    index += `- [${doc.title}](${SITE_URL}/docs/${slug}): ${doc.description}\n`
    full += `## ${doc.title}\n\nSource: ${SITE_URL}/docs/${slug}\n\n${doc.source.replace(/^#\s+.+\n/, "").trim()}\n\n---\n\n`
  }
  index += "\n"
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, "llms.txt"), index.trimEnd() + "\n")
writeFileSync(join(publicDir, "llms-full.txt"), full.trimEnd() + "\n")

console.log("Wrote public/llms.txt and public/llms-full.txt")
