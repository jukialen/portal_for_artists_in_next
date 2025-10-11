'use server';

import { getScopedI18n } from 'locales/server';

import { getUserData } from '../../../../helpers/getUserData';
import { filesComments } from 'utils/comments';

import { FilesCommentsClient } from '../../organisms/FilesCommentsClient/FilesCommentsClient';

type CommentsType = { fileId: string };

export const FilesComments = async ({ fileId }: CommentsType) => {
  const tComments = await getScopedI18n('Comments');

  const firstFilesComments = await filesComments(fileId, 30, 'first');

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
