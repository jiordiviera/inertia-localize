# Product

## Register

brand

## Users

Laravel + Inertia developers evaluating or adopting Inertia Localize. They land here from a
GitHub search, a package registry, or a link in an app's README. They read docs with an editor
and terminal open, often mid-task, and judge a library's quality partly by how its docs look
before they've read a word. They skim for the shape of the API, then copy real code.

## Product Purpose

Public documentation and landing site for the open-source `inertia-localize` package. Success is
a developer understanding the core mental model in one hero + one diagram (Laravel owns
translations, the shared `i18n` prop carries them to React/Vue), then installing and wiring a
locale switch in minutes using the docs.

## Brand Personality

Technical, precise, no frills. Same register as Vercel, Linear, or Stripe's developer docs:
dense information, dark-mode native, typography and real code carrying the page rather than
illustration or marketing copy.

## Anti-references

- Generic SaaS template: big hero number, gradient-washed CTA, three identical feature cards.
- Legacy PHP-ecosystem docs (Laminas/Symfony-era): dense, gray, no visual point of view.
- Anything that reads as decorative rather than earned by the content.

## Design Principles

- Content is the interface. Typography, real code, and the actual API shape carry the page; no
  stock illustration standing in for substance.
- One accent, used with intent. The indigo primary marks the single thing that matters on a
  given screen (the CTA, the active nav item, the diagram's hub node), never sprinkled.
- Every viewport is a real reader. Docs get read on an ultrawide monitor split three ways and on
  a phone on a train. The layout must hold at both extremes, not just at the demo width.
- Show the mechanism. The ecosystem diagram exists because "Laravel shares a prop, adapters read
  it" is faster to grasp as a picture than as three sentences.

## Accessibility & Inclusion

WCAG AA contrast minimum, including muted/secondary text on the dark surface. Full keyboard
navigation (site nav, Cmd+K search palette, mobile drawer), visible focus rings on every
interactive element, `prefers-reduced-motion` respected.
