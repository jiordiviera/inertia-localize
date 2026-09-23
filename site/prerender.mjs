import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, 'dist')
const ssrDir = path.resolve(__dirname, 'dist-ssr')

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
const { render, docRoutes } = await import(path.join(ssrDir, 'entry-server.js'))

for (const url of docRoutes) {
  const appHtml = render(url)
  const html = template.replace('<!--app-html-->', appHtml)
  const outDir = url === '/' ? distDir : path.join(distDir, url)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html)
}

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`Prerendered ${docRoutes.length} routes into dist/.`)
