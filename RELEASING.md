# Releasing

Composer and the published npm packages use one lockstep version. Changesets manages versions and changelogs for `core`, `react`, and `vue` as a fixed group; the Laravel package takes its version from the matching Git tag. The reserved Svelte directory is not a release package.

## Prepare and validate

1. For each user-facing package change, run `pnpm changeset` and commit the generated file under `.changeset/` with the implementation. Choose patch/minor/major and describe the user-visible change.
2. Finish or explicitly defer all scope issues for the release and review public APIs, compatibility, and documentation.
3. Run `pnpm version:packages` on the release branch. Changesets consumes pending entries, updates all fixed npm package versions, and writes per-package `CHANGELOG.md` files. Review these files and make sure their version matches the intended Composer/Git tag.
4. Run the complete checks from the repository root:

   ```sh
   pnpm install --frozen-lockfile
   pnpm build && pnpm test && pnpm lint && pnpm test:e2e
   composer validate --strict --working-dir=packages/laravel
   composer install --no-interaction --prefer-dist --working-dir=packages/laravel
   composer test --working-dir=packages/laravel
   composer test:e2e --working-dir=packages/laravel
   node scripts/validate-release.mjs v0.1.0
   ```

5. Preview package contents without publishing:

   ```sh
   pnpm --filter @inertia-localize/core pack --dry-run
   pnpm --filter @inertia-localize/react pack --dry-run
   pnpm --filter @inertia-localize/vue pack --dry-run
   ```

Check that each npm preview contains its `LICENSE` file. Validate and inspect the Composer source archive with `composer archive --working-dir=packages/laravel`; do not commit the generated archive. CI runs tests for pull requests, version branches, and tags. For tags, it also checks lockstep versions and previews npm package contents. A passing tag workflow is required before publishing.

The first release is bootstrapped manually because earlier implementation PRs predate Changesets. Keep the initial combined notes in the root `CHANGELOG.md`, and do not bump the already aligned `0.1.0` package versions just to create generated changelog files. Future releases use Changesets as above.

## Tag and publish

After the release PR, including Changesets version/changelog updates, is merged into `v0`, create and push an annotated tag from that commit. Prereleases use SemVer identifiers such as `v0.1.0-alpha.1` or `v0.1.0-rc.1`; update npm package versions to the same prerelease version before tagging.

```sh
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

Wait for the tag CI run to pass. Publish npm packages with pnpm in dependency order (`core`, then `react` and `vue`), so `workspace:*` dependencies are rewritten to their released versions:

```sh
cd packages/core && pnpm publish --access public
cd ../react && pnpm publish --access public
cd ../vue && pnpm publish --access public
```

`packages/laravel/` lives in a subdirectory, so Packagist can't read its `composer.json` from a submission of this monorepo's root. Pushing a tag triggers `.github/workflows/split-laravel.yml`, which mirrors `packages/laravel/` (including the same tag) into the read-only [`jiordiviera/inertia-localize-laravel`](https://github.com/jiordiviera/inertia-localize-laravel) repository via `danharrin/monorepo-split-github-action`. Publish the Laravel package to Packagist by submitting that split repository (one-time) or confirming its configured webhook (subsequent releases); never submit the monorepo itself. Create a GitHub Release for the same tag on this repository and summarize the generated package changelogs, package versions, breaking changes, and migration notes. Never publish before all package versions and the tag agree. Do not use `changeset publish` for this repository; publishing stays maintainer-operated so PHP and npm releases share one reviewed tag.

## Credentials and safety

Publishing is a maintainer-operated step; CI does not publish and no package install hook performs release actions. npm publishing requires an authorized npm account/token with public-package access; Packagist requires an account and repository registration/webhook. The split workflow needs its own `LARAVEL_SPLIT_TOKEN` repository secret: a token with write access to `jiordiviera/inertia-localize-laravel` (the default `GITHUB_TOKEN` can't push to a different repository). Store any CI credentials only as narrowly scoped GitHub Actions secrets, never in source, package manifests, logs, or local commits. Prefer trusted publishing or short-lived credentials when available. Verify account, package names, version, and tag before each irreversible publish.

See `.github/RELEASE_TEMPLATE.md` when writing GitHub release notes.
