import { createBrowserClient } from '@supabase/ssr';

import { anonKey, projectId } from 'constants/links';
import { Database } from 'types/database.types';

export function createClient() {
  return createBrowserClient<Database>(projectId!, anonKey!);
}
