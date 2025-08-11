import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const supabase = await createServer();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  let nextParam = searchParams.get('next') ?? '/';

  let redirectPath: string;

  try {
    const requestedUrl = new URL(nextParam, origin);
    const appOriginUrl = new URL(origin);

    if (requestedUrl.hostname === appOriginUrl.hostname && requestedUrl.protocol === appOriginUrl.protocol) {
      redirectPath = requestedUrl.pathname + requestedUrl.search + requestedUrl.hash;
    } else {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  } catch (e) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = req.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
