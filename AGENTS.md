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

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
