import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from '@inertiajs/react'
import { useTranslation } from '../dist/index.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('reads shared Inertia locale data and translates with replacements during SSR', () => {
  const page = {
    component: 'Greeting',
    props: {
      i18n: {
        locale: 'fr',
        fallback: 'en',
        locales: [
          { code: 'en', name: 'English' },
          { code: 'fr', name: 'Français' },
        ],
        messages: { 'greeting.user': 'Bonjour :name' },
      },
    },
    url: '/',
    version: 'test',
  }

  function Greeting() {
    const { t, locale, fallback, locales } = useTranslation()

    return React.createElement(
      'p',
      null,
      `${t('greeting.user', { name: 'Ada' })}|${locale}|${fallback}|${locales[1].name}`,
    )
  }

  const html = renderToString(
    React.createElement(App, {
      initialPage: page,
      initialComponent: Greeting,
      resolveComponent: () => Greeting,
    }),
  )

  assert.match(html, /Bonjour Ada\|fr\|en\|Français/)
})
