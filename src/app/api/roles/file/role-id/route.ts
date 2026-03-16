import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId')!;
  const userId = searchParams.get('userId')!;

  console.log('GET fileId ', fileId);
  console.log('GET userId ', userId);
  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    console.log('GET data', data);

    if (!!error || !data) {
      console.error(error);
      return NextResponse.json({ roleId: 'no id' });
    }

    return NextResponse.json({ roleId: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ roleId: 'no id' });
  }
}
