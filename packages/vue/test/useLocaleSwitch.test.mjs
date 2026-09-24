import assert from 'node:assert/strict'
import { test } from 'node:test'
import { App, router } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h } from 'vue'
import { useLocaleSwitch } from '../dist/index.js'

async function renderWithLocaleSwitch(setup) {
  const calls = []
  const originalPost = router.post

  router.post = (...args) => calls.push(args)

  try {
    const Widget = defineComponent({
      setup() {
        const result = useLocaleSwitch(setup.options)
        setup.onSetup(result)
        return () => h('div')
      },
    })

    const app = createSSRApp(App, {
      initialPage: {
        component: 'Widget',
        props: {},
        url: '/',
        version: 'test',
      },
      initialComponent: Widget,
      resolveComponent: () => Widget,
    })

    await renderToString(app)
  } finally {
    router.post = originalPost
  }

  return calls
}

test('setLocale posts the locale to the default /locale URL', async () => {
  const calls = await renderWithLocaleSwitch({
    onSetup: ({ setLocale }) => setLocale('fr'),
  })

  assert.equal(calls.length, 1)
  const [url, data, options] = calls[0]
  assert.equal(url, '/locale')
  assert.deepEqual(data, { locale: 'fr' })
  assert.equal(options.preserveScroll, true)
  assert.equal(options.preserveState, false)
})

test('accepts a custom url and preserveState option', async () => {
  const calls = await renderWithLocaleSwitch({
    options: { url: '/switch-locale', preserveState: true },
    onSetup: ({ setLocale }) => setLocale('en'),
  })

  const [url, , options] = calls[0]
  assert.equal(url, '/switch-locale')
  assert.equal(options.preserveState, true)
})

test('switching starts false before any switch is triggered', async () => {
  let observed
  await renderWithLocaleSwitch({
    onSetup: ({ switching }) => {
      observed = switching.value
    },
  })

  assert.equal(observed, false)
})
