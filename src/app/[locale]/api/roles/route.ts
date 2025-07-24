import { NextRequest } from 'next/server';
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

    !!error && console.error(error);

    return data?.role!;
  } catch (e) {
    console.error(e);
  }
}
