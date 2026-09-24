---
"@inertia-localize/core": minor
"@inertia-localize/react": minor
"@inertia-localize/vue": minor
---

Add `translateChoice()` to `@inertia-localize/core` (exposed as `tChoice()` on both adapters'
`useTranslation()`), resolving plural forms with Laravel's `trans_choice` pipe-separated DSL
(exact `{n}` and range `[n,m]` selectors, `:count` auto-interpolation). Not ICU MessageFormat —
this keeps lang files identical whether an app also calls `trans_choice()` server-side.
