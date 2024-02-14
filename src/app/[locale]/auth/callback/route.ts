import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from 'types/database.types';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  console.log('cookieStore', cookieStore)
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL(`${req.url}/app`, req.url))
}