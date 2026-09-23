import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { flatDocsNav } from './lib/docs-nav'

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}

export const docRoutes = [
  '/',
  ...flatDocsNav.map((entry) => `/docs/${entry.slug}`),
]
