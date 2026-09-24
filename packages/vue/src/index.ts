import type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  TranslationReplacements,
} from '@inertia-localize/core'
import { translate, translateChoice } from '@inertia-localize/core'
import { router, usePage } from '@inertiajs/vue3'
import type { ComputedRef } from 'vue'
import { computed, ref } from 'vue'

interface LocalizedPageProps {
  i18n: I18nProps
}

export interface UseTranslationResult {
  t: (key: string, replacements?: TranslationReplacements) => string
  tChoice: (
    key: string,
    count: number,
    replacements?: TranslationReplacements,
  ) => string
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
    tChoice: (key, count, replacements = {}) =>
      translateChoice(i18n.value.messages, key, count, replacements),
    locale: computed(() => i18n.value.locale),
    fallback: computed(() => i18n.value.fallback),
    locales: computed(() => i18n.value.locales),
  }
}

export interface UseLocaleSwitchOptions {
  /** The app's registered locale-switch route. Defaults to the documented convention. */
  url?: string
  preserveScroll?: boolean
  preserveState?: boolean
  onSuccess?: () => void
  /** Called with the response body on failure, e.g. `{ message: 'Unsupported locale.' }` for the package's 422. */
  onError?: (errors: Record<string, string>) => void
}

export interface UseLocaleSwitchResult {
  setLocale: (locale: LocaleCode) => void
  switching: ComputedRef<boolean>
}

export function useLocaleSwitch(
  options: UseLocaleSwitchOptions = {},
): UseLocaleSwitchResult {
  const {
    url = '/locale',
    preserveScroll = true,
    preserveState = false,
    onSuccess,
    onError,
  } = options
  const switching = ref(false)

  function setLocale(locale: LocaleCode) {
    router.post(
      url,
      { locale },
      {
        preserveScroll,
        preserveState,
        onStart: () => {
          switching.value = true
        },
        onFinish: () => {
          switching.value = false
        },
        onSuccess,
        onError,
      },
    )
  }

  return { setLocale, switching: computed(() => switching.value) }
}

export type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  MessageDictionary,
  ReplacementValue,
  TranslationReplacements,
} from '@inertia-localize/core'
