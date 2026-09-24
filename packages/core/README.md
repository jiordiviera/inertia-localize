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

## Pluralization

```ts
import { translateChoice } from '@inertia-localize/core'

const messages = {
  'cart.items': '{0} No items|{1} One item|[2,*] :count items',
}

translateChoice(messages, 'cart.items', 0) // "No items"
translateChoice(messages, 'cart.items', 1) // "One item"
translateChoice(messages, 'cart.items', 5) // "5 items"
```

`translateChoice(messages, key, count, replacements?, options?)` uses Laravel's `trans_choice`
pipe-separated DSL: each segment may start with an exact `{n}` or inclusive range `[n,m]`
selector (`*` for infinity); the first matching segment is used, falling back to the last one.
Without any explicit selector, only the 2-segment `singular|plural` shape resolves (`count === 1`
picks the first) — for 3+ forms, use explicit ranges rather than relying on locale-specific
plural rules, which this package does not implement. `:count` is always available for
interpolation and overrides a same-named entry in `replacements`, matching `trans_choice`.

## Shared types

The package exports `LocaleCode`, `LocaleMetadata`, `MessageDictionary`, `TranslationReplacements`, and `I18nProps`. The `I18nProps` shape matches the Laravel/Inertia contract: active locale, fallback locale, available locales, and the current flat message dictionary.

Run `pnpm --filter @inertia-localize/core build` to emit ESM and declarations, or `pnpm --filter @inertia-localize/core test` to build and run behavior and type-contract tests.
