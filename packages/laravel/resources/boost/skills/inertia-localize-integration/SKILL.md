---
name: inertia-localize-integration
description: Integrate Inertia Localize into an existing Laravel + Inertia application (Laravel package + React or Vue adapter) — install, configure locales, wire the session-based locale switch, and read translations with useTranslation(). Use when asked to "add i18n to this Inertia app", "integrate inertia-localize", "set up locale switching with Laravel and Inertia", or "translate this React/Vue page using Laravel translations".
metadata:
  author: jiordiviera
  version: "1.0.0"
---

# Inertia Localize integration

Laravel is the source of truth for locales and translation files. The active locale and
translated messages arrive as an Inertia page prop; there is no client-side fetch or separate
i18n runtime. Do not invent config keys, routes, or hooks beyond what is listed here — verify
against the installed package version if anything looks stale.

## 1. Install

```sh
composer require jiordiviera/inertia-localize
npm install @inertia-localize/react   # or @inertia-localize/vue
php artisan vendor:publish --tag=inertia-localize-config
```

## 2. Configure `config/inertia-localize.php`

Keys: `default`, `fallback`, `locales` (map of code to `['name' => ...]`), `session_key`,
`groups` (Laravel translation groups to expose), `user_column` (optional, persists locale on the
authenticated user).

```php
'locales' => ['en' => ['name' => 'English'], 'fr' => ['name' => 'Français']],
'groups' => ['ui'],
```

Add matching translation files, e.g. `lang/en/ui.php` (or `resources/lang/en/ui.php` on older
Laravel apps):

```php
return ['greeting' => 'Hello :name'];
```

## 3. Register the locale switch route

Must live inside Laravel's session-enabled `web` middleware group (routes in `routes/web.php`
already do).

```php
use InertiaLocalize\Http\Controllers\LocaleController;
use InertiaLocalize\Http\Middleware\SetLocale;

Route::post('/locale', LocaleController::class)->name('locale.switch');

Route::middleware(SetLocale::class)->group(function () {
    Route::get('/', HomeController::class);
});
```

POST `{ locale: 'fr' }` to `locale.switch`. Unsupported values get HTTP 422. `SetLocale` then
sets Laravel's app locale from the session on every request, falling back to `default` when the
session value is missing or invalid.

## 4. Read translations on the frontend

The `i18n` prop (`locale`, `fallback`, `locales`, flattened `messages` like `ui.greeting`) is
shared automatically — no controller changes needed.

```tsx
// React
import { useTranslation } from '@inertia-localize/react'
const { t, locale, locales } = useTranslation()
t('ui.greeting', { name: 'Ada' })
```

```vue
<!-- Vue: same composable name, same return shape -->
<script setup lang="ts">
import { useTranslation } from '@inertia-localize/vue'
const { t, locale, locales } = useTranslation()
</script>
```

`t(key, replacements?)` looks up a flat dot key and interpolates Laravel-style `:name`
placeholders (not `{{mustache}}` or ICU). A missing key returns the key itself unless a fourth
`{ fallback }` argument is given to `@inertia-localize/core`'s underlying `translate()`.

## Troubleshooting

- **`i18n` prop missing**: confirm the route renders through Inertia and the `web` middleware
  group (session-enabled) is applied.
- **Key renders as-is**: check the locale's language file, that its group is listed in
  `groups`, and that the call includes the group prefix (`ui.greeting`, not `greeting`).
- **Locale doesn't persist across sessions**: set `user_column` in the config.

## Compatibility (verify against what's actually installed before relying on exact ranges)

PHP ≥8.2, Laravel 11/12/13, `inertiajs/inertia-laravel` 2 or 3. React ≥16.9 with
`@inertiajs/react` 2 or 3, or Vue 3 with `@inertiajs/vue3` 2 or 3.
