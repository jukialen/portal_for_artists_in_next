import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { getCurrentLocale, getScopedI18n } from 'locales/server';

import { cloudFrontUrl } from 'constants/links';
import { DateObjectType, FilesCommentsType, LangType } from 'types/global.types';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';

import { FilesCommentsClient } from 'components/organisms/FilesCommentsClient/FilesCommentsClient';

type CommentsType = { fileId: string };

const supabase = createServerComponentClient({ cookies });

const filesComments = async (fileId: string, locale: LangType, maxItems: number, dataDateObject: DateObjectType) => {
  const userData = await getUserData();
  
  const { data, error } = await supabase
    .from('FilesComments')
    .select('id, fileId, comment, role, roleId, authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)')
    .eq('fileId', fileId)
    .order('createdAt', { ascending: false })
    .limit(maxItems);

  if (error) throw error;
  const filesArray: FilesCommentsType[] = [];

  if (data?.length === 0) return filesArray;

  for (const first of data!) {
    const { id, fileId, comment, Users, role, roleId, authorId, createdAt, updatedAt } = first;

    filesArray.push({
      fileCommentId: id,
      fileId,
      comment,
      authorName: Users[0].pseudonym!,
      authorProfilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
      role,
      roleId,
      authorId,
      date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
      profilePhoto: userData?.profilePhoto,
    });
  }

  return filesArray;
};
export const FilesComments = async ({ fileId }: CommentsType) => {
  const locale = getCurrentLocale();
  const tComments = await getScopedI18n('Comments');

  const dataDateObject = await dateData();

  const filesFilesComments = await filesComments(fileId, locale, 30, dataDateObject);

  const userData = await getUserData();

  return (
    <FilesCommentsClient
      filesFilesComments={filesFilesComments}
      fileId={fileId}
      dataDateObject={dataDateObject}
      noComments={tComments('noComments')}
      pseudonym={userData?.pseudonym!}
      profilePhoto={userData?.profilePhoto!}
    />
  );
};
