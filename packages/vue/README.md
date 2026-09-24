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

`useTranslation()` returns `t(key, replacements?)`, `tChoice(key, count, replacements?)`, and computed refs for `locale`, `fallback`, and `locales`. Messages use flat dot keys; Laravel-style `:name` placeholders are interpolated by `@inertia-localize/core`.

## Pluralization

```vue
<script setup lang="ts">
const { tChoice } = useTranslation()
</script>

<template>{{ tChoice('cart.items', itemCount) }}</template>
```

Uses Laravel's `trans_choice` pipe-separated DSL (`{0} No items|{1} One item|[2,*] :count items`);
see [`@inertia-localize/core`'s README](https://www.npmjs.com/package/@inertia-localize/core) for the full syntax.

## Switching locale

```vue
<script setup lang="ts">
import { useLocaleSwitch } from '@inertia-localize/vue'

const { setLocale, switching } = useLocaleSwitch()
</script>

<template>
  <button :disabled="switching" @click="setLocale('fr')">Français</button>
</template>
```

`useLocaleSwitch(options?)` returns `setLocale(locale)` and a `switching` computed ref. It posts
to the package's locale-switch route (`/locale` by default — pass `{ url }` if your app
registered it elsewhere) with Inertia's `router.post()`, so the response's redirect refreshes the
`i18n` prop like any other Inertia visit. Also accepts `preserveScroll` (default `true`),
`preserveState` (default `false`), `onSuccess`, and `onError` (called with the response body,
e.g. on the package's 422 for an unsupported locale).

The consuming app must install compatible versions of `vue` and `@inertiajs/vue3`. Run `pnpm --filter @inertia-localize/vue test` to build the package and run its server-rendering test.
