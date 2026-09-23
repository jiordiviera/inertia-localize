# jiordiviera/inertia-localize

Laravel package for Inertia Localize. Laravel remains the source of truth for locale selection, fallback behavior, and translation files. This package does not depend on a frontend framework.

## Package foundation

The service provider is registered through Laravel package discovery. It merges the package defaults and publishes the configuration file:

```sh
php artisan vendor:publish --tag=inertia-localize-config
```

The configuration defines `default`, `fallback`, supported `locales`, `session_key`, translation `groups`, and an optional `user_column`.

## Session locale

Register the locale switch endpoint in `routes/web.php`. Put `SetLocale` on locale-aware routes; routes in `web.php` already start the session before route middleware runs.

```php
use Illuminate\Support\Facades\Route;
use InertiaLocalize\Http\Controllers\LocaleController;
use InertiaLocalize\Http\Middleware\SetLocale;

Route::post('/locale', LocaleController::class)->name('locale.switch');

Route::middleware(SetLocale::class)->group(function () {
    Route::get('/', HomeController::class);
});
```

Post the selected locale as `locale` to `locale.switch`. Supported values are stored under the configured `session_key`; unsupported values receive HTTP 422. On each request, the middleware sets Laravel's application locale from the session and falls back to the configured default when the session value is missing or unsupported. This session-first approach does not add locale URL prefixes or persist a user preference.

## Inertia shared props

The package automatically shares an `i18n` prop on Inertia responses. It contains `locale`, `fallback`, `locales` (`code` and display `name`), and `messages`. Translation groups in `inertia-localize.groups` are loaded for the active locale and flattened to dot keys prefixed by their group, such as `ui.actions.save`. The prop is available in the initial server-rendered page without a client fetch and is included in partial reloads.

## Tests

```sh
composer install --working-dir=packages/laravel
composer test --working-dir=packages/laravel
```
