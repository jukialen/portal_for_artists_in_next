import { NextRequest, NextResponse } from 'next/server';
import { createServer } from 'utils/supabase/clientSSR';

import { selectFiles } from 'constants/selects';
import { FileType, Tags } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/server/roles';
import { name } from 'next/dist/server/ci-info';

const tags: Tags[] = ['animations', 'videos'];

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag')!;
  const authorId = searchParams.get('authorId')!;
  const maxItems = searchParams.get('maxItems')!;

  const supabase = await createServer();

  const filesArray: FileType[] = [];

  try {
    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .eq('tags', tags[parseInt(tag)])
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) return NextResponse.json(filesArray);

    for (const file of data!) {
      const { fileId, name, shortDescription, tags, Users, authorId, fileUrl, createdAt, updatedAt } = file;

      const role = await getFileRoleId(fileId, authorId!);

      role.roleId === 'no id' && NextResponse.json(filesArray);
      filesArray.push({
        idLiked: '',
        liked: false,
        likes: 0,
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        time: await getDate(updatedAt! || createdAt!),
        createdAt,
        tags,
        updatedAt: updatedAt || undefined,
        authorId: authorId!,
        roleId: role.roleId,
      });
    }
    return NextResponse.json(filesArray);
  } catch (e) {
    console.error('no your videos', e);
    return NextResponse.json(filesArray);
  }
}
