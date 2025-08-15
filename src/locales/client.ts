import { createI18nClient } from 'next-international/client';

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  en: () => import('languages/en'),
  pl: () => import('languages/pl'),
  jp: () => import('languages/jp'),
});
