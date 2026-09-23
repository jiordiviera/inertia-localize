<p align="center">
  <img src="assets/inertia-localize-banner.png" alt="Inertia Localize: Laravel translations, anywhere" width="100%">
</p>

# Inertia Localize

Inertia Localize brings Laravel's localization to Inertia applications through small React and Vue adapters. Laravel remains the source of truth for supported locales and translation files; the active locale and selected messages arrive as Inertia page props.

## Quickstart

Install the Laravel package and the adapter for your frontend (packages are published independently):

```sh
composer require jiordiviera/inertia-localize
npm install @inertia-localize/react  # or @inertia-localize/vue
php artisan vendor:publish --tag=inertia-localize-config
```

Configure supported locales and translation groups in `config/inertia-localize.php`:

```php
'locales' => ['en' => ['name' => 'English'], 'fr' => ['name' => 'Français']],
'groups' => ['ui'],
```

Add translations at `lang/en/ui.php` and `lang/fr/ui.php` (older Laravel apps may use `resources/lang`):

```php
return ['greeting' => 'Hello :name'];
```

In `routes/web.php`, register the locale switch endpoint and apply `SetLocale` to routes that need the selected locale. Keep these routes in Laravel's session-enabled `web` middleware group:

```php
use InertiaLocalize\Http\Controllers\LocaleController;
use InertiaLocalize\Http\Middleware\SetLocale;

Route::post('/locale', LocaleController::class)->name('locale.switch');
Route::middleware(SetLocale::class)->group(function () {
    Route::get('/', HomeController::class);
});
```

The locale is session-based: POST `{ locale: 'fr' }` to `locale.switch`, then subsequent requests use that locale. Supported locales, defaulting to `APP_LOCALE`, are validated by the package. Laravel automatically shares `i18n` with Inertia, including `locale`, `fallback`, `locales`, and flattened `messages` such as `ui.greeting`.

In React, call `useTranslation()` from `@inertia-localize/react`; in Vue, use the same composable name from `@inertia-localize/vue` inside `<script setup>`:

```ts
const { t, locale } = useTranslation()
t('ui.greeting', { name: 'Ada' }) // Hello Ada
```

See the [Laravel guide](packages/laravel/README.md), [React guide](packages/react/README.md), and [Vue guide](packages/vue/README.md) for complete examples.

For version compatibility and release changes, see the [changelog](CHANGELOG.md). All `0.x` releases are pre-stable.

## Scope

Locale URL prefixes are not added by default. Laravel owns validation messages; this package shares configured UI translation groups with the client. Frontend adapters use a small translation helper, not a separate heavy i18n runtime.

If `i18n` is missing, confirm the route uses Inertia and Laravel's session-enabled `web` middleware. If a translation key is missing, check the locale's language file, configured `groups`, and the group-prefixed key (for example, `ui.greeting`).

## Development

```sh
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm test:e2e
composer install --working-dir=packages/laravel
composer test --working-dir=packages/laravel
```

The [React + Laravel integration fixture](fixtures/react-laravel/README.md) verifies the request-to-render path. See [CONTRIBUTING.md](CONTRIBUTING.md) for the issue, branch, and pull request workflow.
