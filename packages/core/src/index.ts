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

export function translate(
  messages: MessageDictionary,
  key: string,
  replacements: TranslationReplacements = {},
  options: TranslateOptions = {},
): string {
  const message = Object.hasOwn(messages, key) ? messages[key] : undefined
  const template = typeof message === 'string' ? message : options.fallback ?? key

  return template.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (placeholder, name: string) => {
    if (!Object.hasOwn(replacements, name)) return placeholder

    const value = replacements[name]
    return value === undefined ? placeholder : String(value)
  })
}
