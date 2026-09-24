import assert from 'node:assert/strict'
import { test } from 'node:test'
import { App } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, defineComponent, h } from 'vue'
import { useTranslation } from '../dist/index.js'

test('reads shared Inertia locale data and translates with replacements during SSR', async () => {
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
        messages: {
          'greeting.user': 'Bonjour :name',
          'ui.apples': '{1} une pomme|[2,*] :count pommes',
        },
      },
    },
    url: '/',
    version: 'test',
  }

  const Greeting = defineComponent({
    setup() {
      const { t, tChoice, locale, fallback, locales } = useTranslation()

      return () =>
        h(
          'p',
          `${t('greeting.user', { name: 'Ada' })}|${tChoice('ui.apples', 3)}|${locale.value}|${fallback.value}|${locales.value[1].name}`,
        )
    },
  })

  const app = createSSRApp(App, {
    initialPage: page,
    initialComponent: Greeting,
    resolveComponent: () => Greeting,
  })

  assert.match(
    await renderToString(app),
    /Bonjour Ada\|3 pommes\|fr\|en\|Français/,
  )
})
