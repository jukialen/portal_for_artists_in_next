import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createI18nMiddleware } from 'next-international/middleware';

import { anonKey, projectUrl } from 'constants/links';
import { cookies } from 'next/headers';

const locales = ['en', 'pl', 'jp'];
const defaultLocale = 'en';

const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewrite',
  resolveLocaleFromRequest: (request) => defaultLocale,
});

const publicForAll = ['/settings', '/terms', '/privacy', '/contact', '/faq', '/plans'];
const onlyForGuests = ['/', '/signin', '/signup', '/forgotten'];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });
  const cookieStore = await cookies();

  const supabase = createServerClient(projectUrl!, anonKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });

  const session = await supabase.auth.getSession();

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

  const isAuthCallback = normalizedAuthPath === '/auth/callback' || normalizedAuthPath === '/auth/callback/';

  const redirecSignIntUrl = new URL('/signin', req.url);

  const id = user?.id;

  const { data: userData } = await supabase.from('Users').select('id', { count: 'exact' }).eq('id', id).single();

  if (pathname.startsWith('/new-user') && id && !!userData?.id) return NextResponse.redirect(new URL('/app', req.url));

  if (!isPublicPath && !isGuestOnlyPath) {
    if (user?.app_metadata?.provider !== 'email' && !userData?.id) {
      const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
      const email = user?.user_metadata?.email || user?.email;
      const provider = user?.app_metadata?.provider;
      const pseuusername =
        user?.user_metadata?.custom_claims.global_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.full_name;

      if (!!id) {
        const res = await fetch(avatarUrl, {
          headers: {
            Authorization: `Bearer ${session?.data.session?.provider_token || user?.user_metadata?.provider_id}`,
          },
        });

        const blob = await res.blob();

        const pictureName = avatarUrl.split('/');
        const { data, error: fileError } = await supabase.storage
          .from('profiles')
          .upload(`/${id}/${pictureName[pictureName.length - 1]}`, blob, {
            contentType: blob.type,
          });

        console.log('uploaded', data);

        if (!fileError || !!data) {
          const { error } = await supabase.from('Users').insert([
            {
              id,
              username: pseuusername,
              pseudonym: pseuusername,
              description: '',
              profilePhoto: data?.path,
              email,
              provider,
            },
          ]);

          console.log('error', error);
          if (!error) return NextResponse.redirect(new URL('/app', req.url));
        } else {
          console.log('not uploaded file', fileError);
          return NextResponse.redirect(redirecSignIntUrl);
        }
      } else {
        console.log('!!id', !!id);
        return NextResponse.redirect(redirecSignIntUrl);
      }
    } else if (user?.app_metadata?.provider === 'email' && !userData?.id) {
      return NextResponse.redirect(new URL('/new-user', req.url));
    } else {
      redirecSignIntUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirecSignIntUrl);
    }
  }

  if (!!userData?.id && isGuestOnlyPath && normalizedAuthPath !== '/new-user') {
    const redirectUrl = new URL(`/app`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|sw.js|api|workbox-.*\\.js|favicon.png|robots.txt|.well-known|.*\\.(?:svg|png|ico|json|webmanifest|jpg|jpeg|gif|webp|avif|heif|heic)$).*)',
  ],
};
