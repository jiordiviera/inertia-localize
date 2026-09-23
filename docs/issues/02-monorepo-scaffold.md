# Scaffold the package monorepo

Type: Autonomous

## What to build

Create the initial monorepo structure for `inertia-localize` with separate package boundaries for Laravel, shared TypeScript core, React, Vue, and later Svelte support. The scaffold should make it possible to build and test PHP and TypeScript packages independently while preserving one repository-level workflow.

## Acceptance criteria

- [x] Repository contains `packages/laravel`, `packages/core`, `packages/react`, `packages/vue`, and `packages/svelte`.
- [x] Root metadata describes the repository as `inertia-localize`.
- [x] Composer package metadata exists for `jiordiviera/inertia-localize`.
- [x] npm package metadata exists for `@inertia-localize/core`, `@inertia-localize/react`, and `@inertia-localize/vue`.
- [x] A root README section explains package boundaries.
- [x] Root scripts or documented commands exist for build, test, and lint.
- [x] No placeholder test directories were added before package tooling requires them.

## Blocked by

- `01-release-governance.md`
