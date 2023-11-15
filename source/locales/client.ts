import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  en: () => import('source/languages/en'),
  pl: () => import('source/languages/pl'),
  jp: () => import('source/languages/jp'),
  });