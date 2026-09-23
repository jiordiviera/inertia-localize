import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderInertiaPage } from './renderInertiaPage.mjs'

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
        messages: { 'ui.greeting': 'Bonjour :name' },
      },
    },
    url: '/',
    version: 'test',
  }

  assert.match(renderInertiaPage(page), /Bonjour Ada/)
})
