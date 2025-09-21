import { createBrowserClient } from '@supabase/ssr';

import { publishableKey, projectUrl } from 'constants/links';
import { Database } from 'types/database.types';

export function createClient() {
  return createBrowserClient<Database>(projectUrl!, publishableKey!);
}
