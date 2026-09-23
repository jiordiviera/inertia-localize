import type {
  I18nProps,
  LocaleMetadata,
  TranslationReplacements,
} from '@inertia-localize/core'
import { translate } from '@inertia-localize/core'
import { usePage } from '@inertiajs/vue3'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

interface LocalizedPageProps {
  i18n: I18nProps
}

export interface UseTranslationResult {
  t: (key: string, replacements?: TranslationReplacements) => string
  locale: ComputedRef<I18nProps['locale']>
  fallback: ComputedRef<I18nProps['fallback']>
  locales: ComputedRef<readonly LocaleMetadata[]>
}

export function useTranslation(): UseTranslationResult {
  const page = usePage<LocalizedPageProps>()
  const i18n = computed(() => page.props.i18n)

  return {
    t: (key, replacements = {}) =>
      translate(i18n.value.messages, key, replacements),
    locale: computed(() => i18n.value.locale),
    fallback: computed(() => i18n.value.fallback),
    locales: computed(() => i18n.value.locales),
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
