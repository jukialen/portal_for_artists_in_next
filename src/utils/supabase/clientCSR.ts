import { createBrowserClient } from '@supabase/ssr';

import { anonKey, projectUrl } from 'constants/links';
import { Database } from 'types/database.types';

export function createClient() {
  return createBrowserClient<Database>(projectUrl!, anonKey!);
}
