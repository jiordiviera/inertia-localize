# React + Laravel integration fixture

This small fixture verifies the v0 request path without a demo application. PHPUnit loads the English and French Laravel language files, changes the locale through the session endpoint, and captures the resulting Inertia page props. The same serialized pages are passed to the React SSR page in `packages/react/test/renderInertiaPage.mjs`, which renders `ui.greeting` with `useTranslation()`.

Run from the repository root after `pnpm install` and `composer install --working-dir=packages/laravel`:

```sh
pnpm test:e2e
```
