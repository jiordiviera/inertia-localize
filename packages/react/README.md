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

`useTranslation()` returns `t(key, replacements?)`, `locale`, `fallback`, and `locales`. Messages use flat dot keys; Laravel-style `:name` placeholders are interpolated by `@inertia-localize/core`.

The consuming app must install compatible versions of `react` and `@inertiajs/react`. Run `pnpm --filter @inertia-localize/react test` to build the package and run its server-rendering test.
