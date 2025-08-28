import { selectFiles } from 'constants/selects';
import { FileType, Tags } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';

import { getFileRoleId } from 'utils/roles';
import { createServer } from 'utils/supabase/clientSSR';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const supabase = await createServer();
  const { searchParams } = new URL(req.url);
  const pid = searchParams.get('pid') as Tags;
  const maxItems = searchParams.get('maxItems');
  const lastVisible = searchParams.get('lastVisible');

  const nextArray: FileType[] = [];

  try {
    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('tags', pid)
      .gt('createdAt', lastVisible)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems!));

    if (data?.length === 0 || !!error) return NextResponse.json(nextArray, { status: 400 });

    for (const file of data) {
      const { fileId, name, shortDescription, Users, tags, fileUrl, authorId, createdAt, updatedAt } = file;

      const roleId = await getFileRoleId(fileId, authorId!);

      if (roleId === 'no id') return;

      nextArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        tags,
        time: await getDate(updatedAt! || createdAt!, await dateData()),
      });
    }

    return NextResponse.json(nextArray);
  } catch (e) {
    return NextResponse.json(nextArray, { status: 400 });
  }
};
