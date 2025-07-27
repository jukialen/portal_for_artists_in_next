// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { createServerClient } from '@supabase/ssr';

import { anonKey, projectId } from 'constants/links';

const i18n = createI18nMiddleware({
  locales: ['en', 'pl', 'jp'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
  resolveLocaleFromRequest: () => 'en',
});

export async function middleware(req: NextRequest) {
  const res = i18n(req);

  let supabaseResponse = NextResponse.next({
    request: req,
  });

  const supabase = createServerClient(projectId!, anonKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request: req,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // Możesz np. dodać redirect dla niezalogowanych:
  // if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = '/sign-in';
  //   return NextResponse.redirect(url);
  // }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.png (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.png|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|heif|heic)$).*)',
  ],
};
