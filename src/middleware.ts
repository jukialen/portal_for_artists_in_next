import { type NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

const i18n = createI18nMiddleware({
  locales: ['en', 'pl', 'jp'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault',
  resolveLocaleFromRequest: (req) => {
    return 'en';
  },
});

export async function middleware(req: NextRequest) {
  return i18n(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
