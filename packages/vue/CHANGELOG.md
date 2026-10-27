# @inertia-localize/vue

## 0.2.0

### Minor Changes

- a3e25b2: Add `useLocaleSwitch()` to the React and Vue adapters: posts the selected locale to the
  package's locale-switch route via Inertia's `router.post()` and exposes a `switching` state,
  so apps no longer need to wire that request by hand.
- aad0d31: Add `translateChoice()` to `@inertia-localize/core` (exposed as `tChoice()` on both adapters'
  `useTranslation()`), resolving plural forms with Laravel's `trans_choice` pipe-separated DSL
  (exact `{n}` and range `[n,m]` selectors, `:count` auto-interpolation). Not ICU MessageFormat —
  this keeps lang files identical whether an app also calls `trans_choice()` server-side.

### Patch Changes

- Updated dependencies [a3e25b2]
- Updated dependencies [aad0d31]
  - @inertia-localize/core@0.2.0
