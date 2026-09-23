# Design

## Theme

Dark only. This is a code-heavy developer tool read at any hour, next to a dark editor; there is
no light-mode audience worth the added maintenance. `color-scheme: dark` is set globally; no
theme toggle.

## Color strategy

**Committed**: one saturated indigo carries the accent role everywhere it appears (primary CTA,
active nav/sidebar state, focus rings, the ecosystem diagram's hub node, link hover). It is never
diluted into a second or third accent color. Everything else is a tinted-neutral scale, never
pure black or pure white.

## Palette

All neutrals are tinted toward the brand hue (~275°) at low chroma, never `#000`/`#fff`.

| Token | OKLCH | Hex (reference) | Use |
|---|---|---|---|
| `--color-bg` | `oklch(14.5% 0.006 275)` | `#0A0A0A` | Page background |
| `--color-surface` | `oklch(19% 0.008 275)` | `#151519` | Raised panels, code blocks, cards |
| `--color-surface-2` | `oklch(23% 0.009 275)` | `#1C1C22` | Hover state on surface |
| `--color-border` | `oklch(100% 0 0 / 10%)` | white 10% | Default hairline border |
| `--color-border-strong` | `oklch(100% 0 0 / 18%)` | white 18% | Hovered/emphasized border |
| `--color-primary` | `oklch(58% 0.233 277)` | `#6366F1` | CTA, active state, links, focus ring |
| `--color-primary-soft` | `oklch(81% 0.10 277)` | `#A5B4FC` | Text on primary-tinted surfaces, secondary emphasis |
| `--color-text` | `oklch(96% 0.004 275)` | `#EDEDEE` | Primary text |
| `--color-text-muted` | `oklch(72% 0.006 275)` | `#A9A9B2` | Secondary text — kept ≥4.6:1 on `--color-bg` |
| `--color-text-faint` | `oklch(52% 0.006 275)` | `#727280` | Tertiary/meta text only, never body copy |

The reference brand sheet's light-mode chips (`#FAFAF8` surface, `#E5E7EB` border) describe the
brand's print/light artifacts (banner, social), not this site. On the dark site, "border" is
always a translucent tinted-white hairline, never a literal light-gray fill.

## Typography

- Sans: Geist Variable (`@fontsource-variable/geist`). Mono: Geist Mono Variable
  (`@fontsource-variable/geist-mono`) for all code, keys, and version/compat tables.
- Scale (desktop hero → body), ratio ≥1.25 between adjacent steps: 56/40 (hero h1) → 30 (h2/page
  title) → 20 (h3) → 16 (body) → 13 (meta/labels). Never two adjacent headings at the same size.
- Prose max width: 65ch for docs body copy (`article` content column).
- Weight carries hierarchy alongside size: 700 for headings and the primary CTA, 500 for nav and
  emphasis, 400 for body.

## Layout

- **Global content max-width: `88rem` (1408px), centered (`mx-auto`), with the header, hero, and
  every section sharing the same container.** Nothing spans edge-to-edge except the header's own
  border-bottom line and full-bleed background colors. This is the fix for the "content stretches
  into empty space on a wide monitor" failure: every section wraps in the same constrained,
  centered container instead of relying on flex children to self-limit.
- Section rhythm varies deliberately: hero gets the most vertical room (py-24/28), the ecosystem
  diagram second-most, feature grid and footer are tighter. No two adjacent sections use identical
  vertical padding.
- Docs layout (sidebar / content / TOC) is the one place a fixed three-column grid is correct,
  since it is a utility layout, not the marketing surface — cap its own content column separately
  at 65ch as noted above.

## Components

- **Buttons**: primary = solid `--color-primary`, white text, no gradient. Outline = 1px
  `--color-border`, no fill, brightens border + faint surface tint on hover. No ghost-only CTAs.
- **Badges/pills**: 1px `--color-border`, `--color-primary-soft` text, used sparingly (one per
  section, not decorative repetition).
- **Code blocks**: `--color-surface` background, real Shiki highlighting (no hand-picked inline
  hex per token), 1px `--color-border`.
- **Icons**: isometric icon set from isocons.app, matching the diagram's isometric language,
  replacing ad hoc Unicode glyphs (`⚡ ◇ ✦`) anywhere an icon communicates meaning (features grid,
  nav/social icons where applicable). Consistent single style throughout; never mix an isometric
  icon next to a line icon.
- **Ecosystem diagram**: the one deliberately illustrative element on the page, by design
  (principle: "show the mechanism"). Kept inside the same max-width container as everything else
  so it doesn't read as a floating island on wide viewports.

## Motion

- Transitions 150–200ms, `ease-out` family only (no bounce/elastic).
- Respect `prefers-reduced-motion: reduce`: disable non-essential transitions.

## Elevation

Flat by default (borders do the separating work, per the reference identity). Shadows reserved
for genuinely floating elements (the Cmd+K palette, the mobile drawer) — soft, dark, no glow
except the diagram hub node's intentional indigo glow.
