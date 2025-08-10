import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId')!;
  const userId = searchParams.get('userId')!;

  const supabase = await createServer();

  try {
    const { data, error } = await supabase
      .from('Roles')
      .select('role')
      .eq('roleId', roleId)
      .eq('userId', userId)
      .limit(1)
      .maybeSingle();

    !!error && NextResponse.json({ error }, { status: 400 });

    return NextResponse.json(data?.role!);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
