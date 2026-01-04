import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createI18nMiddleware } from 'next-international/middleware';

import { publishableKey, projectUrl, backUrl, newUserRed } from 'constants/links';
import { locales } from 'constants/values';

const defaultLocale = 'en';
const publicForAll = ['/settings', '/terms', '/privacy', '/contact', '/faq', '/plans'];
const onlyForGuests = ['/', '/signin', '/signup', '/forgotten'];

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewrite',
  resolveLocaleFromRequest: (request) => defaultLocale,
});

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(projectUrl!, publishableKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const redirectSignIntUrl = new URL('/signin', req.url);
  const redirectToNewUser = new URL(newUserRed, req.url);
  const redirectToApp = new URL('/app', req.url);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/auth')) {
    response = i18nMiddleware(req);
  }

  let pathWithoutLocalePrefix = pathname;

  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      pathWithoutLocalePrefix = pathname.substring(`/${locale}`.length);
      break;
    } else if (pathname === `/${locale}` && locale === defaultLocale) {
      pathWithoutLocalePrefix = '/';
      break;
    } else if (pathname === `/${locale}`) {
      pathWithoutLocalePrefix = '/';
      break;
    }
  }

  if (pathname === '/') pathWithoutLocalePrefix = '/';

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
  const isAuthCallback = normalizedAuthPath.startsWith('/auth/callback');

  const id = user?.id;

  const { data: userData } = await supabase.from('Users').select('id, provider').eq('id', id).single();

  if (((!isPublicPath && !isGuestOnlyPath) || isAuthCallback) && !id) return NextResponse.redirect(redirectSignIntUrl);

  if ((normalizedAuthPath === newUserRed || isGuestOnlyPath) && !!userData?.id)
    return NextResponse.redirect(redirectToApp);

  if (user?.app_metadata?.provider !== 'email' && !userData?.id && !!id) {
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const email = user?.user_metadata?.email || user?.email;
    const provider = user?.app_metadata?.provider;
    const pseuusername =
      user?.user_metadata?.custom_claims.global_name ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.full_name;
    const providerToken = session?.provider_token;
    const providerId = user?.user_metadata?.provider_id;

    const newUser = { avatarUrl, id, email, provider, pseuusername, providerToken, providerId };
    const response = await fetch(`${backUrl}/api/auth/create-user`, {
      method: 'POST',
      body: JSON.stringify(newUser),
    });

    if (response.ok) {
      return NextResponse.redirect(redirectToApp);
    } else {
      return NextResponse.redirect(redirectToNewUser);
    }
  }

  if (user?.app_metadata?.provider === 'email' && !userData?.id && !!id) {
    return NextResponse.redirect(redirectToNewUser);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|sw.js|api|workbox-.*\\.js|favicon.png|robots.txt|.well-known|.*\\.(?:svg|png|ico|json|webmanifest|jpg|jpeg|gif|webp|avif|heif|heic)$).*)',
  ],
};
