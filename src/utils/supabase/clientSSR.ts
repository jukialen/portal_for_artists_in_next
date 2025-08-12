import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

import { anonKey, projectUrl } from 'constants/links';
import { Database } from 'types/database.types';

export async function createServer() {
  const cookieStore = await cookies();

  return createServerClient<Database>(projectUrl!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
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
}
