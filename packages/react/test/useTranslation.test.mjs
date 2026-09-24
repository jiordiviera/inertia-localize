import assert from 'node:assert/strict'
import { test } from 'node:test'
import { App } from '@inertiajs/react'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useTranslation } from '../dist/index.js'
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

test('tChoice resolves a plural form from shared Inertia locale data', () => {
  const page = {
    component: 'Cart',
    props: {
      i18n: {
        locale: 'fr',
        fallback: 'en',
        locales: [{ code: 'fr', name: 'Français' }],
        messages: { 'ui.apples': '{1} une pomme|[2,*] :count pommes' },
      },
    },
    url: '/',
    version: 'test',
  }

  function Cart() {
    const { tChoice } = useTranslation()
    return React.createElement('p', null, tChoice('ui.apples', 3))
  }

  const html = renderToStaticMarkup(
    React.createElement(App, {
      initialPage: page,
      initialComponent: Cart,
      resolveComponent: () => Cart,
    }),
  )

  assert.match(html, /3 pommes/)
})
