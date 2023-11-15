import { createI18nServer } from 'next-international/server'

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
 en: () => import('source/languages/en'),
  pl: () => import('source/languages/pl'),
  jp: () => import('source/languages/jp'),
})

