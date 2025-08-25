import { NextRequest, NextResponse } from 'next/server';

import { selectFiles } from 'constants/selects';
import { FileType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get('authorId')!;
  const maxItems = searchParams.get('maxItems')!;

  const supabase = await createServer();

  const filesArray: FileType[] = [];

  try {
    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) return NextResponse.json(filesArray);

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

      const roleId = await getFileRoleId(fileId, authorId!);

      roleId === 'no id' && NextResponse.json(filesArray);

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        authorId: authorId!,
        time: await getDate(updatedAt! || createdAt!, await dateData()),
        createdAt,
        roleId,
        updatedAt: updatedAt || '',
      });
    }
    return NextResponse.json(filesArray);
  } catch (e) {
    console.error('no your videos', e);
    return NextResponse.json(filesArray);
  }
}
