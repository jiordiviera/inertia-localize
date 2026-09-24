import type {
  I18nProps,
  LocaleCode,
  LocaleMetadata,
  MessageDictionary,
  TranslationReplacements,
} from '../src/index.js'
import { translate, translateChoice } from '../src/index.js'

const locale: LocaleCode = 'fr'
const localeMetadata: LocaleMetadata = { code: locale, name: 'French' }
const messages: MessageDictionary = { 'greeting.user': 'Hello :name' }
const replacements: TranslationReplacements = {
  name: 'Ada',
  count: 2,
  active: true,
}
const pageProps: I18nProps = {
  locale,
  fallback: 'en',
  locales: [localeMetadata],
  messages,
}
const translated: string = translate(messages, 'greeting.user', replacements)
const choiceMessages: MessageDictionary = {
  'cart.items': '{0} No items|{1} One item|[2,*] :count items',
}
const chosen: string = translateChoice(
  choiceMessages,
  'cart.items',
  3,
  replacements,
)

void [pageProps, translated, chosen]
