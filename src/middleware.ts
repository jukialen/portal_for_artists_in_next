import { type NextRequest, NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

import { anonKey, projectId } from 'constants/links';

const i18nMiddleware = createI18nMiddleware({
  locales: ['en', 'pl', 'jp'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
  resolveLocaleFromRequest: () => 'en',
});

const publicForAll = ['/settings', '/terms', '/privacy', '/contact', '/faq', '/plans'];
const onlyForGuests = ['/', '/signin', '/signup', '/forgotten', '/new-user'];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  });

  const supabase = createServerClient(projectId!, anonKey!, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Aktualizujemy ciasteczka w przychodzącym żądaniu
        req.cookies.set({ name, value, ...options });
        // I w odpowiedzi, która zostanie wysłana do klienta
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({ name, value: '', ...options });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  const normalize = (p: string) => (p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p);
  const normalizedPath = normalize(pathname);
  const isIn = (list: string[]) => list.some((p) => normalizedPath === p || normalizedPath.startsWith(`${p}/`));

  const isGuestOnlyPath = isIn(onlyForGuests);
  const isPublicPath = isIn(publicForAll);

  if (user && isGuestOnlyPath) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  if (!user && !isPublicPath && !isGuestOnlyPath) {
    const redirectUrl = new URL('/signin', req.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  response = i18nMiddleware(req);

  return response;
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
    '/((?!_next/static|_next/image|sw.js|workbox-.*\\.js|favicon.png|robots.txt|.well-known/*|.*\\.(?:svg|png|ico|json|webmanifest|jpg|jpeg|gif|webp|avif|heif|heic)$).*)',
  ],
};
