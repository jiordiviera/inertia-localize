# Package Plan

This document records package boundaries and planned API shapes for the `inertia-localize` monorepo. Check each package README and source for implemented behavior; proposed snippets here may change. Track implementation in the repository's GitHub issues.

## Laravel Package

Composer package:

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

npm package:

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

The current core API also accepts `{ fallback: '...' }` as a fourth argument for a custom missing-key string.

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

## Implementation Sequence

Build and validate the packages directly in this repository. Do not prototype in an external application and extract later.

1. Establish the monorepo structure and tooling (`02-monorepo-scaffold`).
2. Implement the framework-independent translation engine (`03-core-translation-engine`).
3. Build Laravel locale handling, session switching, and Inertia props (`04`-`06`).
4. Add React and Vue adapters (`07`-`08`).
5. Verify the integration fixture and publish a quickstart (`09`-`10`).
6. Add release automation and prepare `v0.1.0` (`11`-`12`).

The initial scope is Laravel, Inertia, React, and Vue. Svelte and other adapters are future options, not part of the first milestone. Resolve open API questions in their implementation issues before treating the sketches above as commitments.
