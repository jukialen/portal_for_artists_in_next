import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId')!;
  const userId = searchParams.get('userId')!;

  try {
    const supabase = await createServer();

    const { data, error } = await supabase
      .from('Roles')
      .select('id')
      .eq('fileId', fileId)
      .eq('userId', userId)
      .limit(1)
      .single();

    if (!!error) {
      console.error(error);
      return NextResponse.json('no id');
    }

    return NextResponse.json({ roleId: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json('no id');
  }
}
