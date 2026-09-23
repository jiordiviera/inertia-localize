# Define branch, versioning, and release governance

Type: Needs decision

## Decisions and implementation

`v0` is the default branch and active development line; do not create `main` or `master`. Reserve future long-lived branches such as `v1` and `v2` for major release lines. Short-lived branches use `<type>/<version>-<issue-slug>`, for example `feat/v0-42-core-translate`.

Open an issue and agree on scope before creating a work branch. Submit changes through a pull request to the matching version branch, link the issue (for example `Closes #42`), and obtain review before merging.

Composer and all npm packages use lockstep versions. Release tags use a `v` prefix, including prereleases such as `v0.1.0-alpha.1` and `v0.1.0-rc.1`. Before `1.0.0`, breaking changes may be released in a minor version and patches remain compatible fixes. After `1.0.0`, follow SemVer strictly; stable major lines accept compatible fixes while breaking changes target the next major line.

Contributor expectations and reporting procedures are in `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

## Acceptance criteria

- [x] The default development branch is documented as `v0`.
- [x] Branch policy documents long-lived version branches: `v0`, future `v1`, future `v2`.
- [x] Temporary branch naming is documented, for example `feat/v0-42-core-translate` and `fix/v0-57-session-locale`.
- [x] Contribution workflow requires an issue before a work branch and a reviewed PR to merge.
- [x] SemVer expectations are documented for pre-1.0 and post-1.0 releases.
- [x] Tag format is documented, including `v0.1.0`, `v0.1.0-alpha.1`, and `v0.1.0-rc.1`.
- [x] Package versioning is lockstep across Composer and npm packages.
- [x] Release rules explain what can change in `v0.x` without a major branch.
- [x] Contributor conduct and reporting are documented.

## Blocked by

None - can start immediately.
