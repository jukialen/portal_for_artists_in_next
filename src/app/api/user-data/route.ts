import { NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

export async function GET(): Promise<NextResponse> {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const id = user?.id;

  if (!id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { data, error } = await supabase.from('Users').select('*').eq('id', id).limit(1).maybeSingle();

  const { data: fileData } = await supabase.from('Files').select('fileUrl').eq('authorId', id);

  if (data) {
    return NextResponse.json({
      id,
      pseudonym: data?.pseudonym,
      description: data?.description,
      profilePhoto: `${!fileData || fileData.length === 0 ? data?.profilePhoto : fileData[0].fileUrl}`,
      email: user?.email,
      plan: data?.plan,
      provider: data?.provider,
      billingCycle: data?.billingCycle,
    });
  }

  return NextResponse.json({ error: error?.message || 'User not found' }, { status: 404 });
}
