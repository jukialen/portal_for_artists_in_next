'use server';

import { FileType, IndexType, Tags } from '../../types/global.types';
import { createServer } from '../../utils/supabase/clientSSR';
import { selectFiles } from '../../constants/selects';
import { getFileRoleId } from '../../utils/roles';
import { getDate } from '../../helpers/getDate';
import { dateData } from '../../helpers/dateData';

export const translated = async () => {
  const { getScopedI18n } = await import('../../locales/server');

  const tComments = await getScopedI18n('Comments');

  return tComments('noComments');
};

export const graphics = async (maxItems: number, authorId: string, step: 'first' | 'again', lastVisible?: string) => {
  const supabase = await createServer();

  const filesArray: FileType[] = [];

  try {
    if (step === 'first') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId === 'no id') return filesArray;

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          time: await getDate(updatedAt! || createdAt!, await dateData()),
          createdAt,
          updatedAt: updatedAt || '',
        });
      }
      return filesArray;
    } else if (step === 'again') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId === 'no id') return filesArray;

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          time: await getDate(updatedAt! || createdAt!, await dateData()),
          createdAt,
          updatedAt: updatedAt || '',
        });
      }

      return filesArray;
    } else {
      console.log('Incorrect step');
    }
  } catch (e) {
    console.error(e);
  }
};

export const videosAnimations = async (
  tag: 0 | 1,
  maxItems: number,
  authorId: string,
  step: 'first' | 'again',
  lastVisible?: string,
) => {
  const supabase = await createServer();
  const tags: Tags[] = ['animations', 'videos'];

  const filesArray: FileType[] = [];

  try {
    if (step === 'first') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .eq('tags', tags[tag])
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId === 'no id') return filesArray;
        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          time: await getDate(updatedAt! || createdAt!, await dateData()),
          createdAt,
          updatedAt: updatedAt || undefined,
        });
      }
      return filesArray;
    } else if (step === 'again') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .eq('tags', tags[tag])
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId === 'no id') return filesArray;

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl,
          time: await getDate(updatedAt! || createdAt!, await dateData()),
          createdAt,
          updatedAt: updatedAt || '',
        });
      }
      return filesArray;
    } else {
      console.log('Incorrect step');
    }
  } catch (e) {
    console.error('no your videos', e);
    return filesArray;
  }
};

export const drawings = async (index: IndexType, lastVisible: string, maxItems: number) => {
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
        .limit(maxItems);

      if (data?.length === 0) return nextArray;

      for (const draw of data!) {
        const { fileId, name, fileUrl, tags, shortDescription, Users, authorId, createdAt, updatedAt } = draw;

        const roleId = await getFileRoleId(fileId, authorId!);

        if (roleId == 'no id') return nextArray;

        nextArray.push({
          authorName: Users?.pseudonym!,
          fileId,
          name,
          shortDescription: shortDescription!,
          fileUrl,
          tags,
          time: await getDate(updatedAt! || createdAt!, await dateData()),
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
};
