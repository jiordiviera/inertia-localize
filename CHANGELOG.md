# Changelog

This project follows Semantic Versioning. Versions below `1.0.0` are pre-stable; public APIs may change between minor releases. The initial release notes are maintained at the repository root. Changesets generates per-package changelogs for subsequent releases.

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
