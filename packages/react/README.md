# @inertia-localize/react

React hook for the `i18n` page prop shared by `inertia-localize`'s Laravel package. It reads current Inertia props directly; it does not keep a second locale or message dictionary in React state.

```tsx
import { useTranslation } from '@inertia-localize/react'

export function Greeting() {
  const { t, locale, locales } = useTranslation()

  return (
    <p lang={locale}>
      {t('greeting.user', { name: 'Ada' })}
      {' '}
      ({locales.length} languages)
    </p>
  )
}
```

`useTranslation()` returns `t(key, replacements?)`, `tChoice(key, count, replacements?)`, `locale`, `fallback`, and `locales`. Messages use flat dot keys; Laravel-style `:name` placeholders are interpolated by `@inertia-localize/core`.

## Pluralization

```tsx
const { tChoice } = useTranslation()

tChoice('cart.items', itemCount)
```

Uses Laravel's `trans_choice` pipe-separated DSL (`{0} No items|{1} One item|[2,*] :count items`);
see [`@inertia-localize/core`'s README](https://www.npmjs.com/package/@inertia-localize/core) for the full syntax.

## Switching locale

```tsx
import { useLocaleSwitch } from '@inertia-localize/react'

export function LocaleSwitcher() {
  const { setLocale, switching } = useLocaleSwitch()

  return (
    <button disabled={switching} onClick={() => setLocale('fr')}>
      Français
    </button>
  )
}
```

`useLocaleSwitch(options?)` returns `setLocale(locale)` and a `switching` boolean. It posts to the
package's locale-switch route (`/locale` by default — pass `{ url }` if your app registered it
elsewhere) with Inertia's `router.post()`, so the response's redirect refreshes the `i18n` prop
like any other Inertia visit. Also accepts `preserveScroll` (default `true`), `preserveState`
(default `false`), `onSuccess`, and `onError` (called with the response body, e.g. on the
package's 422 for an unsupported locale).

The consuming app must install compatible versions of `react` and `@inertiajs/react`. Run `pnpm --filter @inertia-localize/react test` to build the package and run its server-rendering test.
