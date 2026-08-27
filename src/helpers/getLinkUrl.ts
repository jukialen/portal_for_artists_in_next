import { createServer } from 'utils/supabase/clientSSR';

export const getLinkUrl = async (
  bucket: 'basic' | 'logos' | 'profiles',
  fallback: string,
  link?: string | null,
): Promise<string> => {
  const supabase = await createServer();
  return link
    ? (await supabase.storage.from(bucket).createSignedUrl(link!, 3600, { download: false })).data!.signedUrl
    : fallback;
};
