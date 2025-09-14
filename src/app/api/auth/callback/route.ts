import { NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === 'development';

    return !error
      ? NextResponse.redirect(isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin)
      : NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
