import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

import { selectFiles } from 'constants/selects';
import { Database } from 'types/database.types';
import { FileType, IndexType } from 'types/global.types';

import { getCurrentLocale } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/roles';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const index = searchParams.get('index');
  const lastVisible = searchParams.get('lastVisible');
  const maxItems = searchParams.get('maxItems')!;

  const locale = getCurrentLocale();
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const nextArray: FileType[] = [];

  try {
    const isValidIndex = (param: string | null): param is IndexType => {
      return param === 'photographs' || param === 'videos' || param === 'animations';
    };

    if (isValidIndex(index)) {
      const { data } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('tags', index!)
        .gt('createdAt', lastVisible)
        .order('name', { ascending: false })
        .limit(parseInt(maxItems));

      if (data?.length === 0) return nextArray;

      for (const draw of data!) {
        const { fileId, name, fileUrl, tags, shortDescription, Users, authorId, createdAt, updatedAt } = draw;

        const roleId = await getFileRoleId(fileId, authorId!);

        nextArray.push({
          authorName: Users?.pseudonym!,
          fileId,
          name,
          shortDescription: shortDescription!,
          fileUrl,
          authorId: authorId!,
          tags,
          time: getDate(locale!, updatedAt! || createdAt!, await dateData()),
          roleId,
        });
      }

      return nextArray;
    } else {
      return nextArray;
    }
  } catch (e) {
    console.error(e);
    return nextArray;
  }
}
