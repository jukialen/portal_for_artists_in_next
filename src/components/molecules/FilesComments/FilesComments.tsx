'use server';

import { getCurrentLocale, getScopedI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';
import { getUserData } from 'helpers/getUserData';
import { filesComments } from 'utils/comments';

import { FilesCommentsClient } from 'components/organisms/FilesCommentsClient/FilesCommentsClient';

type CommentsType = { fileId: string };

export const FilesComments = async ({ fileId }: CommentsType) => {
  const locale = getCurrentLocale();
  const tComments = await getScopedI18n('Comments');

  const dataDateObject = await dateData();

  const firstFilesComments = await filesComments(fileId, locale, 30, dataDateObject);

  const userData = await getUserData();

  return (
    <FilesCommentsClient
      firstFilesComments={firstFilesComments}
      fileId={fileId}
      dataDateObject={dataDateObject}
      noComments={tComments('noComments')}
      pseudonym={userData?.pseudonym!}
      locale={locale}
    />
  );
};
