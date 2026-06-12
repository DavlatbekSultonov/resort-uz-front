// src/i18n/i18n.js
import uz from './locales/uz.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

export const LANGUAGES = {
  uz: { label: "O'zbek", flag: '🇺🇿' },
  ru: { label: 'Русский', flag: '🇷🇺' },
  en: { label: 'English', flag: '🇬🇧' }
}

const translations = { uz, ru, en }

// Nested key: "home.title" -> translations.uz.home.title
export function t(lang, key) {
  const keys = key.split('.')
  let val = translations[lang] || translations.uz
  for (const k of keys) {
    val = val?.[k]
    if (val === undefined) return key
  }
  return val
}

export default translations