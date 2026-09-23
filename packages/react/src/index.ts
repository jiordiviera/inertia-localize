import { usePage } from '@inertiajs/react'
import { translate } from '@inertia-localize/core'
import type {
  I18nProps,
  LocaleMetadata,
  TranslationReplacements,
} from '@inertia-localize/core'

interface LocalizedPageProps {
  i18n: I18nProps
}

export interface UseTranslationResult {
  t: (key: string, replacements?: TranslationReplacements) => string
  locale: I18nProps['locale']
  fallback: I18nProps['fallback']
  locales: readonly LocaleMetadata[]
}

export function useTranslation(): UseTranslationResult {
  const { i18n } = usePage<LocalizedPageProps>().props

  return {
    t: (key, replacements = {}) =>
      translate(i18n.messages, key, replacements),
    locale: i18n.locale,
    fallback: i18n.fallback,
    locales: i18n.locales,
  }
}

export type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  MessageDictionary,
  ReplacementValue,
  TranslationReplacements,
} from '@inertia-localize/core'
