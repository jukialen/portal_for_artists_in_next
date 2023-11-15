import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  en: () => import('src/languages/en'),
  pl: () => import('src/languages/pl'),
  jp: () => import('src/languages/jp'),
  });