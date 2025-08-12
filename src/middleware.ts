import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createI18nMiddleware } from 'next-international/middleware';

import { anonKey, projectUrl } from 'constants/links';

const locales = ['en', 'pl', 'jp'];
const defaultLocale = 'en';

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewrite',
  resolveLocaleFromRequest: (request) => defaultLocale,
});

const publicForAll = ['/settings', '/terms', '/privacy', '/contact', '/faq', '/plans'];
const onlyForGuests = ['/', '/signin', '/signup', '/forgotten', '/new-user'];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: { headers: new Headers(req.headers) },
  });

  const supabase = createServerClient(projectUrl!, anonKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        } catch (error) {
          console.error('Supabase setAll error in middleware:', error);
        }
      },
    },
  });

  await supabase.auth.getSession();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  response = i18nMiddleware(req);

  const { pathname } = req.nextUrl;

  let pathWithoutLocalePrefix = pathname;
  let detectedLocale: string | undefined;

  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      pathWithoutLocalePrefix = pathname.substring(`/${locale}`.length);
      detectedLocale = locale;
      break;
    } else if (pathname === `/${locale}` && locale === defaultLocale) {
      pathWithoutLocalePrefix = '/';
      detectedLocale = locale;
      break;
    } else if (pathname === `/${locale}`) {
      pathWithoutLocalePrefix = '/';
      detectedLocale = locale;
      break;
    }
  }

  if (!detectedLocale && pathname === '/') {
    pathWithoutLocalePrefix = '/';
    detectedLocale = defaultLocale;
  } else if (!detectedLocale) {
    pathWithoutLocalePrefix = pathname;
    detectedLocale = defaultLocale;
  }

  if (!pathWithoutLocalePrefix.startsWith('/')) {
    pathWithoutLocalePrefix = `/${pathWithoutLocalePrefix}`;
  }
  const normalizedAuthPath =
    pathWithoutLocalePrefix.endsWith('/') && pathWithoutLocalePrefix !== '/'
      ? pathWithoutLocalePrefix.slice(0, -1)
      : pathWithoutLocalePrefix;

  const isIn = (list: string[]) => list.some((p) => normalizedAuthPath === p || normalizedAuthPath.startsWith(`${p}/`));

  const isGuestOnlyPath = isIn(onlyForGuests);
  const isPublicPath = isIn(publicForAll);

  if (user && isGuestOnlyPath) {
    const redirectUrl = new URL(`/${detectedLocale}/app`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && !isPublicPath && !isGuestOnlyPath) {
    const redirectUrl = new URL(`/${detectedLocale}/signin`, req.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|sw.js|workbox-.*\\.js|favicon.png|robots.txt|.well-known/*|.*\\.(?:svg|png|ico|json|webmanifest|jpg|jpeg|gif|webp|avif|heif|heic)$).*)',
  ],
};
