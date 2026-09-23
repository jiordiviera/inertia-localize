# Inertia Localize

Working name for a Laravel-first localization package that integrates with Inertia apps across React, Vue, Svelte, and plain TypeScript clients.

## Purpose

Make session-based localization feel native in Laravel + Inertia apps:

- Laravel owns locale detection, fallback, translations, and server-rendered data.
- Inertia shares the active locale and UI messages as page props.
- Frontend adapters expose small framework-native helpers like `useTranslation()`.
- Apps can start with Laravel language files and later plug into translation platforms.

## Core Opinion

Laravel should be the source of truth.

The package should not require React, Vue, or any frontend runtime to own the dictionaries. It should expose Laravel translations to Inertia in a predictable, SSR-safe shape.

## Target Stack

- Laravel
- Inertia Laravel
- React adapter
- Vue adapter
- Svelte adapter, later
- Optional SSR
- Session-based locale by default

## Non-goals

- URL locale prefixes by default
- Replacing Laravel localization
- Owning validation translations
- Forcing one frontend framework
- Shipping a heavy client i18n runtime unless an adapter asks for it

## Package Shape

Possible split:

```txt
inertia-localize/
  packages/
    laravel/
    react/
    vue/
    svelte/
    core/
```

Alternative monorepo names:

- `inertia-localize`
- `inertia-i18n-kit`
- `laravel-inertia-locales`
- `inertia-localize`

Current preferred name: `inertia-localize`.
