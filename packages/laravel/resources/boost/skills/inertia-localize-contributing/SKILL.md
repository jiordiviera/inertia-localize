---
name: inertia-localize-contributing
description: Contribute to the jiordiviera/inertia-localize repository — its issue-first workflow, branch naming, version-branch pull requests, package boundaries, and development commands. Use when asked to "contribute to inertia-localize", "open a PR for this repo", "fix a bug in inertia-localize", "add a feature to inertia-localize", or "release inertia-localize".
metadata:
  author: jiordiviera
  version: "1.0.0"
---

# Contributing to inertia-localize

## Workflow

1. Open or find a GitHub issue before starting work; agree on scope there first for anything
   substantial. Never start a branch without an issue.
2. `v0` is the default branch — the active development line. Never create `main` or `master`.
3. Branch from `v0` (or the relevant version branch) using `<type>/<version>-<issue-slug>`, e.g.
   `feat/v0-42-core-translate` or `fix/v0-57-session-locale`.
4. Open the PR back to that same version branch. Link the issue; use `Closes #<n>` when the PR
   fully resolves it.
5. Keep the PR focused: motivation, implementation summary, checks run, compatibility impact.
   Screenshots for user-facing UI changes.
6. Wait for review; don't merge your own PR without an explicit maintainer policy allowing it.

## Package boundaries

- `packages/laravel/`: Composer package. Owns locale detection, session handling, and sharing
  the `i18n` Inertia prop. No frontend-framework dependency.
- `packages/core/`: framework-independent TypeScript engine (dot-key lookup, `:name`
  interpolation, shared types). Source in `src/`, tests in `test/` (`.test.mjs` + `test-contract.ts`).
- `packages/react/`, `packages/vue/`: thin adapters exposing `useTranslation()`, backed by
  `@inertia-localize/core` and the current Inertia page props.
- `packages/svelte/`: reserved, not part of the current release scope.
- `site/`: the public docs website (Vite + React), not a published package.

Keep APIs small and framework-native. `camelCase` functions, `PascalCase` React components,
dot-key examples like `actions.save`. Laravel code follows standard Laravel conventions for
classes, middleware, and config.

## Commands

```sh
pnpm build                                          # all packages with a build script
pnpm test                                           # all packages with a test script
pnpm --filter @inertia-localize/core build
pnpm --filter @inertia-localize/core test
pnpm lint                                           # Biome, repo-wide
pnpm format                                         # Biome --write
composer install --working-dir=packages/laravel
composer test --working-dir=packages/laravel
composer test:e2e --working-dir=packages/laravel
```

## Commits and changesets

Concise, imperative commit subjects, preferably Conventional Commits (`feat(core): add fallback
lookup`). Add or update focused tests for behavior changes; update docs (including the relevant
`packages/*/README.md` and, if user-facing, `site/src/content/docs/*.mdx`) when public APIs or
workflows change.

For any user-facing change to `core`, `react`, or `vue`, add a Changesets entry with
`pnpm changeset` in the same commit — they're a fixed version group; release maintainers run
`pnpm version:packages` to cut versions and changelogs. Full release mechanics (tagging,
lockstep validation, npm/Packagist publishing) live in `RELEASING.md` — that stays a
maintainer-operated step; don't tag or publish as part of routine contribution work.

## Versioning

SemVer tags prefixed with `v` (`v0.1.0`, `v0.1.0-alpha.1`, `v0.1.0-rc.1`). Before `1.0.0`,
breaking changes may ship in a minor release; patches are compatible fixes only. After `1.0.0`,
follow SemVer strictly.

Follow `CODE_OF_CONDUCT.md` for all interactions.
