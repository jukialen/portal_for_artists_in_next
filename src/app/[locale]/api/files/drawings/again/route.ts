import { NextRequest, NextResponse } from 'next/server';

import { selectFiles } from 'constants/selects';
import { FileType, IndexType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/roles';
import { createServer, Locale } from 'utils/supabase/clientSSR';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const index = searchParams.get('index');
  const lastVisible = searchParams.get('lastVisible');
  const maxItems = searchParams.get('maxItems')!;

  const supabase = await createServer();

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

      if (data?.length === 0) return NextResponse.json(nextArray);

      for (const draw of data!) {
        const { fileId, name, fileUrl, tags, shortDescription, Users, authorId, createdAt, updatedAt } = draw;

        const roleId = await getFileRoleId(fileId, authorId!);

        roleId == 'no id' && NextResponse.json(nextArray);

        nextArray.push({
          authorName: Users?.pseudonym!,
          fileId,
          name,
          shortDescription: shortDescription!,
          fileUrl,
          authorId: authorId!,
          tags,
          time: getDate(await Locale, updatedAt! || createdAt!, await dateData()),
          roleId,
        });
      }

      return NextResponse.json(nextArray);
    } else {
      return NextResponse.json(nextArray);
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(nextArray);
  }
}
