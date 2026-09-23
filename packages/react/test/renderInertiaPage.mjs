import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { App } from '@inertiajs/react'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { useTranslation } from '../dist/index.js'

export function renderInertiaPage(page) {
  function Greeting() {
    const { t, locale } = useTranslation()

    return React.createElement(
      'h1',
      { lang: locale },
      t('ui.greeting', { name: 'Ada' }),
    )
  }

  return renderToString(
    React.createElement(App, {
      initialPage: page,
      initialComponent: Greeting,
      resolveComponent: () => Greeting,
    }),
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  let input = ''

  for await (const chunk of process.stdin) {
    input += chunk
  }

  const pages = JSON.parse(input)
  process.stdout.write(JSON.stringify(pages.map(renderInertiaPage)))
}
