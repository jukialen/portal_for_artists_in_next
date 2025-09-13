import { NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) {
    next = '/new-user';
  }

  if (code) {
    const supabase = await createServer();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error('Session exchange failed', error);
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
