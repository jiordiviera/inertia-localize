# Changelog

This project follows Semantic Versioning. Versions below `1.0.0` are pre-stable; public APIs may change between minor releases. The initial release notes are maintained at the repository root. Changesets generates per-package changelogs for subsequent releases.

## [0.2.0] - Unreleased

### Added

- `useLocaleSwitch()` in the React and Vue adapters: posts the selected locale to the package's locale-switch route through Inertia's `router.post()` and exposes a `switching` state.
- `translateChoice()` in `@inertia-localize/core`, exposed as `tChoice()` by both adapters. It resolves plural forms with Laravel's `trans_choice` pipe-separated syntax (exact `{n}` and range `[n,m]` selectors, automatic `:count` interpolation). It is not ICU MessageFormat, so lang files stay identical whether the app also calls `trans_choice()` server-side.

### Compatibility

- Same as 0.1.0. The new APIs are additive; no existing call changes behaviour.

### Migration Notes

None required. To use plural forms, switch `t('key', { count })` to `tChoice('key', { count })` where the lang file uses the pipe syntax.

## [0.1.0] - Unreleased

This is the first usable, pre-stable release. Pin package versions and review release notes before upgrading; compatibility is not guaranteed across future `0.x` minor versions.

### Added

- Laravel package `jiordiviera/inertia-localize` for supported locales, session-based locale switching, route middleware, and automatically shared Inertia `i18n` props.
- Translation-group export from Laravel language files as group-prefixed dot keys, such as `ui.actions.save`.
- Framework-independent `@inertia-localize/core` translation helper with Laravel-style `:name` interpolation.
- React `useTranslation()` and Vue `useTranslation()` adapters backed by current Inertia page props.
- React + Laravel integration fixture covering locale switching through translated server-rendered UI.
- MIT licensing for the Composer package and all npm packages.

### Compatibility

- PHP 8.2 or later; Laravel 11, 12, or 13.
- `inertiajs/inertia-laravel` 2 or 3.
- React 16.9 or later with `@inertiajs/react` 2 or 3.
- Vue 3 with `@inertiajs/vue3` 2 or 3.

### Migration Notes

Not applicable; this is the first release.
