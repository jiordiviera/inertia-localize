# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a planning-stage package for `inertia-localize`, a Laravel-first localization toolkit for Inertia apps. Root documents define the product direction:

- `README.md`: purpose, target stack, package philosophy, and non-goals.
- `PACKAGE_PLAN.md`: proposed Laravel, core TypeScript, React, Vue, and future Svelte package responsibilities.

When implementation begins, keep the planned monorepo shape:

```txt
packages/
  laravel/
  core/
  react/
  vue/
  svelte/
```

Place framework-specific tests beside their package or under each package's `tests/` directory. Keep shared fixtures and examples small and clearly named.

## Build, Test, and Development Commands

No package manager or test runner is committed yet. Add commands as the scaffold lands and document them here. Expected future commands:

- `composer test`: run Laravel package tests.
- `npm test` or `pnpm test`: run TypeScript adapter tests.
- `npm run build` or `pnpm build`: compile frontend packages.
- `npm run lint` or `pnpm lint`: run formatting and static checks.

Prefer one top-level command per workflow once the monorepo tooling is chosen.

## Coding Style & Naming Conventions

Use clear package boundaries: Laravel owns locale detection and Inertia props; frontend packages consume the shared `i18n` prop. Keep APIs small and framework-native, for example `useTranslation()` in React and Vue composables.

Use Laravel conventions for PHP classes, middleware, config, and translations. Use TypeScript for frontend packages, `camelCase` for functions, `PascalCase` for React components, and dot-key examples such as `actions.save`.

## Testing Guidelines

Test locale resolution, session behavior, fallback handling, placeholder interpolation, and Inertia prop shape. Adapter tests should verify helper output without requiring a full application where possible. Name tests after behavior, for example `it_interpolates_laravel_placeholders` or `translate.fallback.test.ts`.

## Commit & Pull Request Guidelines

Git history is not available in this sandbox, so no existing commit convention could be verified. Use concise imperative commits such as `Add locale middleware plan` or `Implement core translate helper`.

Pull requests should include a short summary, affected package paths, test results, and screenshots only when UI examples change. Link related issues or design notes when resolving open questions from `PACKAGE_PLAN.md`.
