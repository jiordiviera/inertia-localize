# @inertia-localize/core

Framework-independent translation helpers and shared types for Inertia Localize adapters.

## Translation

```ts
import { translate } from '@inertia-localize/core'

translate({ 'greeting.user': 'Hello :name' }, 'greeting.user', { name: 'Ada' })
// "Hello Ada"
```

Messages use flat dot-key dictionaries. Missing keys return the key by default; pass an explicit fallback as the fourth argument when needed:

```ts
translate({}, 'greeting.user', { name: 'Ada' }, { fallback: 'Hello :name' })
// "Hello Ada"
```

Laravel-style placeholders use `:name` syntax. Replacements accept strings, numbers, and booleans. Unknown placeholders remain unchanged.

## Shared types

The package exports `LocaleCode`, `LocaleMetadata`, `MessageDictionary`, `TranslationReplacements`, and `I18nProps`. The `I18nProps` shape matches the Laravel/Inertia contract: active locale, fallback locale, available locales, and the current flat message dictionary.

Run `pnpm --filter @inertia-localize/core build` to emit ESM and declarations, or `pnpm --filter @inertia-localize/core test` to build and run behavior and type-contract tests.
