import { NextRequest } from 'next/server';
import { createServer, Locale } from "utils/supabase/clientSSR";

import { selectFiles } from 'constants/selects';
import { FileType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { getFileRoleId } from 'utils/roles';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get('authorId')!;
  const maxItems = searchParams.get('maxItems')!;
  const lastVisible = searchParams.get('lastVisible')!;

  const supabase = await createServer();
  

  try {
    const filesArray: FileType[] = [];

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
      .gt('createdAt', lastVisible)
      .order('createdAt', { ascending: false })
      .limit(parseInt(maxItems));

    if (data?.length === 0 || !!error) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

      const roleId = await getFileRoleId(fileId, authorId!);

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        authorId: authorId!,
        time: getDate(await Locale, updatedAt! || createdAt!, await dateData()),
        createdAt,
        roleId,
        updatedAt: updatedAt || '',
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
}
