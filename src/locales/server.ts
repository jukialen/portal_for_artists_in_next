import { createI18nServer } from 'next-international/server';

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
   en: () => import('languages/en'),
   pl: () => import('languages/pl'),
   jp: () => import('languages/jp'),
})
