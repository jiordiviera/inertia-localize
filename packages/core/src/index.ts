export type MessageDictionary = Readonly<Record<string, string>>
export type LocaleCode = string

export interface LocaleMetadata {
  code: LocaleCode
  name: string
}

export interface I18nProps {
  locale: LocaleCode
  fallback: LocaleCode
  locales: readonly LocaleMetadata[]
  messages: MessageDictionary
}

export type ReplacementValue = string | number | boolean
export type TranslationReplacements = Readonly<Record<string, ReplacementValue>>

export interface TranslateOptions {
  fallback?: string
}

function interpolate(
  template: string,
  replacements: TranslationReplacements,
): string {
  return template.replace(
    /:([A-Za-z_][A-Za-z0-9_]*)/g,
    (placeholder, name: string) => {
      if (!Object.hasOwn(replacements, name)) return placeholder

      const value = replacements[name]
      return value === undefined ? placeholder : String(value)
    },
  )
}

export function translate(
  messages: MessageDictionary,
  key: string,
  replacements: TranslationReplacements = {},
  options: TranslateOptions = {},
): string {
  const message = Object.hasOwn(messages, key) ? messages[key] : undefined
  const template =
    typeof message === 'string' ? message : (options.fallback ?? key)

  return interpolate(template, replacements)
}

interface ChoiceSegment {
  message: string
  /** Present when the segment carries an explicit `{n}` or `[n,m]` selector. */
  test?: (count: number) => boolean
}

function parseChoiceSegment(segment: string): ChoiceSegment {
  const exact = segment.match(/^\{(\d+)\}\s*(.*)$/s)
  if (exact) {
    const target = Number(exact[1])
    return { test: (count) => count === target, message: exact[2] }
  }

  const range = segment.match(/^\[(\d+),(\*|\d+)\]\s*(.*)$/s)
  if (range) {
    const min = Number(range[1])
    const max = range[2] === '*' ? Number.POSITIVE_INFINITY : Number(range[2])
    return { test: (count) => count >= min && count <= max, message: range[3] }
  }

  return { message: segment }
}

/**
 * Selects a plural form using Laravel's `trans_choice` DSL: pipe-separated segments,
 * each optionally prefixed with an exact `{n}` or inclusive `[n,m]` (`*` for infinity)
 * selector. Without any explicit selector, only the 2-segment `singular|plural` shape
 * is resolved (count === 1 picks the first); locale-specific plural-index rules for
 * 3+ unmarked segments are out of scope — use explicit ranges for those instead.
 */
export function translateChoice(
  messages: MessageDictionary,
  key: string,
  count: number,
  replacements: TranslationReplacements = {},
  options: TranslateOptions = {},
): string {
  const message = Object.hasOwn(messages, key) ? messages[key] : undefined
  const template =
    typeof message === 'string' ? message : (options.fallback ?? key)

  const segments = template.split('|').map(parseChoiceSegment)

  let selected: string
  if (segments.length === 1) {
    selected = segments[0].message
  } else if (segments.some((segment) => segment.test)) {
    const matched = segments.find((segment) => segment.test?.(count))
    selected = (matched ?? segments[segments.length - 1]).message
  } else {
    selected = (count === 1 ? segments[0] : segments[segments.length - 1])
      .message
  }

  return interpolate(selected, { ...replacements, count })
}
