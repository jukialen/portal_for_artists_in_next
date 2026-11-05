'use server';

import { revalidatePath } from 'next/cache';
import { selectFiles } from 'constants/selects';
import { FileType, IndexType, Tags } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getLinkUrl } from 'helpers/getLinkUrl';
import { createServer } from 'utils/supabase/clientSSR';
import { getFileRoleId } from 'app/actions/roles';
import { likeList } from 'app/actions/likes';

export const graphics = async (
  maxItems: number,
  authorId: string,
  step: 'first' | 'again' = 'first',
  lastVisible?: string,
): Promise<FileType[]> => {
  const supabase = await createServer();
  const inArray: Tags[] = ['realistic', 'manga', 'anime', 'comics', 'photographs'];

  const filesArray: FileType[] = [];

  try {
    if (step === 'first') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .in('tags', inArray)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt, tags } = file;

        const likeData = await likeList(authorId, 'fileId', fileId);
        const photoLink = await getLinkUrl('basic', `/#`, fileUrl);

        const role = await getFileRoleId(fileId, authorId);

        filesArray.push({
          authorId,
          roleId: role.roleId,
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl: photoLink,
          tags,
          time: await getDate(updatedAt! || createdAt!),
          createdAt,
          updatedAt: updatedAt || '',
          liked: likeData?.liked,
          likes: likeData?.likes,
        });
      }
      return filesArray;
    } else if (step === 'again') {
      const { data, error } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', authorId)
        .in('tags', inArray)
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0 || !!error) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt, tags } = file;

        const likeData = await likeList(authorId, 'fileId', fileId);
        const photoLink = await getLinkUrl('basic', `/#`, fileUrl);
        const role = await getFileRoleId(fileId, authorId);

        filesArray.push({
          authorId,
          roleId: role.roleId,
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl: photoLink,
          tags,
          time: await getDate(updatedAt! || createdAt!),
          createdAt,
          updatedAt: updatedAt || '',
          liked: likeData?.liked,
          likes: likeData?.likes,
        });
      }

      return filesArray;
    } else {
      console.log('Incorrect step');
      return filesArray;
    }
  } catch (e) {
    console.error(e);
    return filesArray;
  }
};

export const videosAnimations = async (
  tag: 0 | 1,
  maxItems: number,
  authorId: string,
  step: 'first' | 'again' = 'first',
  lastVisible?: string,
): Promise<FileType[]> => {
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
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt, tags } = file;

        const likeData = await likeList(authorId, 'fileId', fileId);
        const photoLink = await getLinkUrl('basic', `/#`, fileUrl);
        const role = await getFileRoleId(fileId, authorId!);

        if (role.roleId === 'no id') return filesArray;

        filesArray.push({
          authorId,
          roleId: role.roleId,
          tags,
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl: photoLink,
          time: await getDate(updatedAt! || createdAt!),
          createdAt,
          updatedAt: updatedAt || undefined,
          liked: likeData?.liked,
          likes: likeData?.likes,
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
        const { fileId, name, shortDescription, Users, fileUrl, createdAt, updatedAt, tags } = file;

        const likeData = await likeList(authorId, 'fileId', fileId);
        const photoLink = await getLinkUrl('basic', `/#`, fileUrl);
        const role = await getFileRoleId(fileId, authorId!);

        if (role.roleId === 'no id') return filesArray;

        filesArray.push({
          authorId,
          roleId: role.roleId,
          tags,
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          authorProfilePhoto: Users?.profilePhoto!,
          fileUrl: photoLink,
          time: await getDate(updatedAt! || createdAt!),
          createdAt,
          updatedAt: updatedAt || '',
          liked: likeData?.liked,
          likes: likeData?.likes,
        });
      }
      return filesArray;
    } else {
      console.log('Incorrect step');
      return filesArray;
    }
  } catch (e) {
    console.error('no your videos', e);
    return filesArray;
  }
};

export const drawings = async (index: IndexType, lastVisible: string, maxItems: number): Promise<FileType[]> => {
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

        const likeData = await likeList(authorId!, 'fileId', fileId);
        const photoLink = await getLinkUrl('basic', `/#`, fileUrl);
        const role = await getFileRoleId(fileId, authorId!);

        if (role.roleId == 'no id') return nextArray;

        nextArray.push({
          authorName: Users?.pseudonym!,
          fileId,
          authorId: authorId!,
          roleId: role.roleId,
          name,
          shortDescription: shortDescription!,
          fileUrl: photoLink,
          tags,
          time: await getDate(updatedAt! || createdAt!),
          liked: likeData?.liked,
          likes: likeData?.likes,
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

export const updateProfilePhoto = async (
  formData: FormData,
): Promise<{ success: boolean; error?: string; path?: string }> => {
  const file = formData.get('photo') as File | null;
  if (!file) return { success: false, error: 'no-file' };

  try {
    const supabase = await createServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'unauthorized' };

    const pathPhoto = `/${user.id}/${file.name}`;

    const { data: fileList, error: listError } = await supabase.storage.from('profiles').list(user.id);

    if (!listError && fileList && fileList.length > 0) {
      const filesToRemove = fileList.map((f) => `${user.id}/${f.name}`);
      await supabase.storage.from('profiles').remove(filesToRemove);
    }

    const { data, error: uploadError } = await supabase.storage.from('profiles').upload(pathPhoto, file, {
      contentType: file.type,
      upsert: true,
    });

    if (uploadError || !data?.path) {
      console.error(uploadError);
      return { success: false, error: uploadError?.message || 'upload-error' };
    }

    const { error: dbError } = await supabase
      .from('Users')
      .update({ profilePhoto: data.path })
      .eq('id', user.id);

    if (dbError) {
      console.error(dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, path: data.path };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e?.message || 'unknown-error' };
  }
};
