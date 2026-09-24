# Repository Guidelines

## Project Structure & Module Organization

This repository is an early-stage monorepo for `inertia-localize`, a Laravel-first localization toolkit for Inertia apps. Packages live under `packages/`:

- `laravel/`: Composer package for Laravel integration.
- `core/`: framework-independent TypeScript engine; source in `src/`, behavior and type tests in `test/`.
- `react/` and `vue/`: frontend adapters.
- `svelte/`: reserved for possible future support.

`README.md` is the repository overview. Unresolved design questions are tracked as GitHub issues rather than in a standalone planning document.

When implementation begins, keep the planned monorepo shape:

```txt
packages/
  laravel/
  core/
  react/
  vue/
  svelte/
```

Keep package tests alongside their package. Shared fixtures and examples should remain small and clearly named.

## Build, Test, and Development Commands

Use pnpm for the TypeScript workspace and Composer for the Laravel package:

- `pnpm build`: build packages that define a build script.
- `pnpm test`: run tests for packages that define a test script.
- `pnpm --filter @inertia-localize/core build`: compile core ESM and declarations.
- `pnpm --filter @inertia-localize/core test`: build core and run behavior and type-contract tests.
- `composer test` from `packages/laravel`: will be added with the Laravel test setup.

Biome handles formatting, lint rules, and import sorting for supported JavaScript and TypeScript files. Run `pnpm lint` to check the repository and `pnpm format` to format supported files.

## Coding Style & Naming Conventions

Use clear package boundaries: Laravel owns locale detection and Inertia props; frontend packages consume the shared `i18n` prop. Keep APIs small and framework-native, for example `useTranslation()` in React and Vue composables.

Use Laravel conventions for PHP classes, middleware, config, and translations. Use TypeScript for frontend packages, `camelCase` for functions, `PascalCase` for React components, and dot-key examples such as `actions.save`.

## Testing Guidelines

Core behavior tests use Node's built-in `node:test` runner in `.test.mjs` files; TypeScript type contracts live in `test/type-contract.ts`. Cover lookup, missing-key fallback, interpolation, and shared prop types. Laravel and adapter tests will follow their package test tooling.

## Commit & Pull Request Guidelines

Use concise imperative commits, preferably Conventional Commits, for example `feat(core): add translation lookup`.

Follow `CONTRIBUTING.md`: open an issue before creating a work branch, target the matching version branch with a pull request, link the issue, and include relevant checks in the PR description.
