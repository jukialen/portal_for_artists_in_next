import { NextRequest, NextResponse } from 'next/server';

import { createServer } from 'utils/supabase/clientSSR';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServer();
    const { avatarUrl, providerToken, providerId, id, pseuusername, email, provider } = await req.json();

    const res = await fetch(avatarUrl, {
      headers: {
        Authorization: `Bearer ${providerToken || providerId}`,
      },
    });

    const blob = await res.blob();

    const pictureName = avatarUrl.split('/');

    const { data, error: fileError } = await supabase.storage
      .from('profiles')
      .upload(`/${id}/${pictureName[pictureName.length - 1]}`, blob, {
        contentType: blob.type,
      });

    if (!fileError || !!data) {
      const { data: dUser, error } = await supabase
        .from('Users')
        .insert([
          {
            id,
            username: pseuusername,
            pseudonym: pseuusername,
            description: '',
            profilePhoto: data?.path,
            email,
            provider,
          },
        ])
        .select('username')
        .maybeSingle();

      return error ? NextResponse.json({ error }, { status: 500 }) : NextResponse.json({ data: dUser, error });
    } else {
      console.log('not uploaded file', fileError);
      return NextResponse.json({ data, error: fileError }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
  }
}
