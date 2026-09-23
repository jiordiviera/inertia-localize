# jiordiviera/inertia-localize

Laravel package for Inertia Localize. Laravel remains the source of truth for locale selection, fallback behavior, and translation files. This package does not depend on a frontend framework.

## Package foundation

The service provider is registered through Laravel package discovery. It merges the package defaults and publishes the configuration file:

```sh
php artisan vendor:publish --tag=inertia-localize-config
```

The configuration defines `default`, `fallback`, supported `locales`, `session_key`, translation `groups`, and an optional `user_column`. Locale middleware, session switching, translation export, and Inertia props are implemented in later issues.

## Tests

```sh
composer install --working-dir=packages/laravel
composer test --working-dir=packages/laravel
```
