import type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  TranslationReplacements,
} from '@inertia-localize/core'
import { translate } from '@inertia-localize/core'
import { router, usePage } from '@inertiajs/react'
import { useCallback, useState } from 'react'

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
    t: (key, replacements = {}) => translate(i18n.messages, key, replacements),
    locale: i18n.locale,
    fallback: i18n.fallback,
    locales: i18n.locales,
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
  switching: boolean
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
  const [switching, setSwitching] = useState(false)

  const setLocale = useCallback(
    (locale: LocaleCode) => {
      router.post(
        url,
        { locale },
        {
          preserveScroll,
          preserveState,
          onStart: () => setSwitching(true),
          onFinish: () => setSwitching(false),
          onSuccess,
          onError,
        },
      )
    },
    [url, preserveScroll, preserveState, onSuccess, onError],
  )

  return { setLocale, switching }
}

export type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  MessageDictionary,
  ReplacementValue,
  TranslationReplacements,
} from '@inertia-localize/core'
