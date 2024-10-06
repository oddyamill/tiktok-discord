import { Locale, LocaleString } from 'discord-api-types/v10'
import en from './en.json'
import ru from './ru.json'
import uk from './uk.json'

const defaultLocale = en

export const localization = new Map<LocaleString, typeof defaultLocale>()
  .set(Locale.EnglishUS, en)
  .set(Locale.EnglishGB, en)
  .set(Locale.Russian, ru)
  .set(Locale.Ukrainian, uk)

export type TranslatorKey = keyof typeof defaultLocale
export type Translator = (key: TranslatorKey) => string

export const getTranslator = (locale: LocaleString): Translator => {
  const translations = localization.get(locale) ?? defaultLocale

  return (key) => translations[key] ?? key
}
