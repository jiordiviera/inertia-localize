# Contributing

## Start with an issue

Open or find a GitHub issue before starting work. Describe the bug, proposal, or task and agree on its scope there. Do not create a work branch until an issue exists. For substantial changes, discuss the approach in the issue first.

## Branches and pull requests

- `v0` is the default branch and active development line. Do not create `main` or `master`.
- Future major lines use long-lived branches such as `v1` and `v2`.
- Create a short-lived branch from the target version branch, using `<type>/<version>-<issue-slug>`; for example `feat/v0-42-core-translate` or `fix/v0-57-session-locale`.
- Open a pull request back to that same version branch. Link the issue with `Closes #42` when the PR fully resolves it.
- Keep changes focused. Explain the motivation, summarize the implementation, list checks run, and flag any compatibility impact. Add screenshots for changed user-facing UI.
- Request review and address feedback before merging. Do not merge your own PR without an explicit maintainer policy allowing it.

## Commits and code

Use concise imperative commit subjects, optionally following Conventional Commits (for example, `feat(core): add fallback lookup`). Follow the established formatter and tests in the package being changed; until tooling is committed, keep formatting consistent with nearby files. Add or update focused tests for behavior changes and update docs when public APIs or workflows change.

## Releases and versioning

Composer and all npm packages share one lockstep version. Use SemVer tags prefixed with `v`, such as `v0.1.0`, `v0.1.0-alpha.1`, and `v0.1.0-rc.1`. Before `1.0.0`, breaking changes may ship in a minor release; patch releases are for compatible fixes. After `1.0.0`, follow SemVer strictly. The `v0` line may evolve before `1.0.0`; stable `v1` and later lines receive compatible fixes only, with breaking changes developed on the next major line.

## Conduct

All contributors must follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Report unacceptable behavior privately to the repository maintainers.
