# Package Plan

## Laravel Package

Composer package idea:

```txt
jiordiviera/inertia-localize
```

Responsibilities:

- Register supported locales.
- Provide `SetLocale` middleware.
- Store locale in session by default.
- Optionally persist locale on the authenticated user.
- Share `i18n` props through Inertia.
- Export selected Laravel translation groups to frontend messages.
- Support fallback locale.

Example config:

```php
return [
    'default' => env('APP_LOCALE', 'en'),
    'fallback' => env('APP_FALLBACK_LOCALE', 'en'),
    'locales' => [
        'en' => ['name' => 'English'],
        'fr' => ['name' => 'Français'],
    ],
    'session_key' => 'locale',
    'groups' => ['ui'],
    'user_column' => null,
];
```

Shared Inertia prop:

```php
'i18n' => [
    'locale' => 'fr',
    'fallback' => 'en',
    'locales' => [
        ['code' => 'en', 'name' => 'English'],
        ['code' => 'fr', 'name' => 'Français'],
    ],
    'messages' => [
        'actions.save' => 'Enregistrer',
    ],
]
```

## Core JavaScript Package

NPM package idea:

```txt
@inertia-localize/core
```

Responsibilities:

- Resolve dot keys.
- Interpolate Laravel-style placeholders like `:name`.
- Provide fallback behavior.
- Provide types shared by adapters.

API sketch:

```ts
translate(messages, 'dashboard.heading', { name: 'Ada' })
```

## React Adapter

NPM package idea:

```txt
@inertia-localize/react
```

API sketch:

```tsx
import { useTranslation } from '@inertia-localize/react'

function Heading() {
  const { t, locale } = useTranslation()

  return <h1>{t('dashboard.heading', { name: 'Ada' })}</h1>
}
```

## Vue Adapter

NPM package idea:

```txt
@inertia-localize/vue
```

API sketch:

```vue
<script setup>
import { useTranslation } from '@inertia-localize/vue'

const { t } = useTranslation()
</script>

<template>
  <h1>{{ t('dashboard.heading', { name: 'Ada' }) }}</h1>
</template>
```

## Inertia Integration

Requirements:

- Works with standard Inertia shared props.
- No client-side fetch needed for initial render.
- SSR-safe because messages arrive with page props.
- Compatible with partial reloads.
- Optional lazy message groups later.

## Open Questions

- Should message groups be flattened server-side or client-side?
- Should frontend adapters support ICU pluralization or keep Laravel placeholder style?
- Should package expose a language switch form helper?
- Should user persistence be first-party or app-owned?
- Should Vue adapter expose both composable and plugin?

## First Milestone

Build the package behavior manually inside Prooflog:

1. `lang/en/ui.php` and `lang/fr/ui.php`
2. `SetLocale` middleware
3. `LocaleController`
4. `i18n` shared Inertia prop
5. React `useTranslation()`
6. Language switcher component
7. Dashboard/footer/menu translated

Then extract only once the API feels stable.
