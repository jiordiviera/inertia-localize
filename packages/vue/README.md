# @inertia-localize/vue

Vue composable for the `i18n` page prop shared by `inertia-localize`'s Laravel package. It reads current Inertia page props directly and requires no Vue plugin.

```vue
<script setup lang="ts">
import { useTranslation } from '@inertia-localize/vue'

const { t, locale, locales } = useTranslation()
</script>

<template>
  <p :lang="locale">
    {{ t('greeting.user', { name: 'Ada' }) }}
    ({{ locales.length }} languages)
  </p>
</template>
```

`useTranslation()` returns `t(key, replacements?)` and computed refs for `locale`, `fallback`, and `locales`. Messages use flat dot keys; Laravel-style `:name` placeholders are interpolated by `@inertia-localize/core`.

The consuming app must install compatible versions of `vue` and `@inertiajs/vue3`. Run `pnpm --filter @inertia-localize/vue test` to build the package and run its server-rendering test.
