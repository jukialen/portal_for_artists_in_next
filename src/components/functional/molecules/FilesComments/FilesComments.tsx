import { getScopedI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getDate } from 'helpers/getDate';
import { getUserData } from 'helpers/getUserData';
import { filesComments } from 'utils/comments';
import { likeList } from 'utils/likes';
import { createServer } from 'utils/supabase/clientSSR';

import { FilesCommentsType } from 'types/global.types';

import { FilesCommentsClient } from 'components/functional/organisms/FilesCommentsClient/FilesCommentsClient';

type CommentsType = { fileId: string };

const filesServerComments = async (fileId: string, maxItems: number) => {
  const supabase = await createServer();
  const filesArray: FilesCommentsType[] = [];

  const { data, error } = await supabase
    .from('FilesComments')
    .select(
      'id, fileId, content, roleId, Roles!roleId (role), authorId, createdAt, updatedAt, Users (pseudonym, profilePhoto)',
    )
    .eq('fileId', fileId)
    .order('createdAt', { ascending: false })
    .limit(Number(maxItems));

  if (!data || data?.length === 0 || !!error) return filesArray;

  for (const first of data!) {
    const { id, fileId, content, Users, Roles, roleId, authorId, createdAt, updatedAt } = first;

    filesArray.push({
      fileCommentId: id,
      fileId,
      content,
      authorName: Users?.pseudonym!,
      authorProfilePhoto: Users?.profilePhoto!,
      role: Roles?.role!,
      roleId,
      authorId,
      likes: (await likeList(authorId, undefined, fileId))!.likes,
      liked: (await likeList(authorId, undefined, fileId))!.liked,
      date: await getDate(updatedAt! || createdAt!, await dateData()),
    });
  }

  return filesArray;
};

export const FilesComments = async ({ fileId }: CommentsType) => {
  const tComments = await getScopedI18n('Comments');

  const firstFilesComments = await filesServerComments(fileId, 30);
  const userData = await getUserData();

  return (
    <FilesCommentsClient
      firstFilesComments={firstFilesComments!}
      fileId={fileId}
      noComments={tComments('noComments')}
      pseudonym={userData?.pseudonym!}
    />
  );
};
