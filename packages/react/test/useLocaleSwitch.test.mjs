import assert from 'node:assert/strict'
import { test } from 'node:test'
import { App, router } from '@inertiajs/react'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useLocaleSwitch } from '../dist/index.js'

function renderWithLocaleSwitch(setup) {
  const calls = []
  const originalPost = router.post

  router.post = (...args) => calls.push(args)

  try {
    function Widget() {
      const result = useLocaleSwitch(setup.options)
      setup.onRender(result)
      return null
    }

    renderToStaticMarkup(
      React.createElement(App, {
        initialPage: {
          component: 'Widget',
          props: {},
          url: '/',
          version: 'test',
        },
        initialComponent: Widget,
        resolveComponent: () => Widget,
      }),
    )
  } finally {
    router.post = originalPost
  }

  return calls
}

test('setLocale posts the locale to the default /locale URL', () => {
  const calls = renderWithLocaleSwitch({
    onRender: ({ setLocale }) => setLocale('fr'),
  })

  assert.equal(calls.length, 1)
  const [url, data, options] = calls[0]
  assert.equal(url, '/locale')
  assert.deepEqual(data, { locale: 'fr' })
  assert.equal(options.preserveScroll, true)
  assert.equal(options.preserveState, false)
})

test('accepts a custom url and preserveState option', () => {
  const calls = renderWithLocaleSwitch({
    options: { url: '/switch-locale', preserveState: true },
    onRender: ({ setLocale }) => setLocale('en'),
  })

  const [url, , options] = calls[0]
  assert.equal(url, '/switch-locale')
  assert.equal(options.preserveState, true)
})

test('switching starts false before any switch is triggered', () => {
  let observed
  renderWithLocaleSwitch({
    onRender: ({ switching }) => {
      observed = switching
    },
  })

  assert.equal(observed, false)
})
