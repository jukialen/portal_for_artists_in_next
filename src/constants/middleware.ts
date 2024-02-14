import { NextRequest } from 'next/server'
import { createI18nMiddleware } from 'next-international/middleware'
import * as process from "process";

const i18n = createI18nMiddleware({
    locales: ['en', 'pl', 'jp'],
    defaultLocale: 'en',
    urlMappingStrategy: 'rewriteDefault',
    resolveLocaleFromRequest: request => {
      return 'en'
    },
  }
)

export function middleware(request: NextRequest) {
  return i18n(request)
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
}