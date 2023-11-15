import { createI18nServer } from 'next-international/server'

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
 en: () => import('src/languages/en'),
  pl: () => import('src/languages/pl'),
  jp: () => import('src/languages/jp'),
})

