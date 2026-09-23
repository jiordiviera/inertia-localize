# Inertia Localize

Inertia Localize brings Laravel's localization to Inertia applications with small, framework-native frontend adapters. Laravel remains the source of truth for locales, translations, and fallback behavior; Inertia delivers the active locale and selected messages with page props.

> Project status: planning. Package APIs and implementation are not available yet.

## Planned packages

| Package | Registry | Purpose |
| --- | --- | --- |
| `jiordiviera/inertia-localize` | Composer | Laravel locale handling, translation export, and Inertia props |
| `@inertia-localize/core` | npm | Framework-independent lookup, interpolation, and shared types |
| `@inertia-localize/react` | npm | React translation helpers |
| `@inertia-localize/vue` | npm | Vue translation helpers |

The initial release focuses on Laravel, Inertia, React, and Vue. Other adapters may follow after the core API is established.

## Design principles

- Use Laravel translation files as the default source of messages.
- Support session-based locale selection by default.
- Deliver initial messages through Inertia props for server rendering and client navigation.
- Keep frontend adapters small and avoid requiring a specific frontend framework for the Laravel package.

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for the issue, branch, and pull request workflow. See [PACKAGE_PLAN.md](PACKAGE_PLAN.md) for package responsibilities, proposed data shapes, and unresolved design questions. The current project backlog is tracked in [GitHub Issues](https://github.com/jiordiviera/inertia-localize/issues).

No build or test commands are available yet; they will be documented when the monorepo scaffold is added.
