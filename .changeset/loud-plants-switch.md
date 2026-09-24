---
"@inertia-localize/core": minor
"@inertia-localize/react": minor
"@inertia-localize/vue": minor
---

Add `useLocaleSwitch()` to the React and Vue adapters: posts the selected locale to the
package's locale-switch route via Inertia's `router.post()` and exposes a `switching` state,
so apps no longer need to wire that request by hand.
