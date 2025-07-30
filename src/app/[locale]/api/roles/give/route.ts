import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function POST(req: NextRequest) {
  const supabase = await createServer();

  const requestBody: { roleId: string } = await req.json();

  try {
    const { data, error } = await supabase.from('Roles').select('role').eq('id', requestBody.roleId).limit(1).single();

    if (!!error) return NextResponse.json({ message: error.message }, { status: 400 });

    return NextResponse.json(data?.role!);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 400 });
  }
}
