import { selectFiles } from 'constants/selects';
import { DateObjectType, FileType, LangType, Tags } from 'types/global.types';
import { getDate } from 'helpers/getDate';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/database.types';
import { cookies } from 'next/headers';

const supabase = createServerComponentClient<Database>({ cookies });

export const tags: Tags[] = ['animations', 'videos'];

export const graphics = async (
  locale: LangType,
  maxItems: number,
  authorId: string,
  dataDateObject: DateObjectType,
) => {
  try {
    const filesArray: FileType[] = [];

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0 || !!error) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        authorId: authorId!,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt: updatedAt || '',
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};

export const videosAnimations = async (
  tags: Tags,
  locale: LangType,
  maxItems: number,
  authorId: string,
  dataDateObject: DateObjectType,
) => {
  try {
    const filesArray: FileType[] = [];

    const { data, error } = await supabase
      .from('Files')
      .select(selectFiles)
      .eq('authorId', authorId)
      .eq('tags', tags)
      .order('createdAt', { ascending: false })
      .limit(maxItems);

    if (data?.length === 0 || !!error) return filesArray;

    for (const file of data!) {
      const { fileId, name, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

      filesArray.push({
        fileId,
        name,
        shortDescription: shortDescription!,
        authorName: Users?.pseudonym!,
        authorProfilePhoto: Users?.profilePhoto!,
        fileUrl,
        authorId: authorId!,
        time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        createdAt,
        updatedAt: updatedAt || '',
      });
    }
    return filesArray;
  } catch (e) {
    console.error('no your videos', e);
  }
};
