import { getCurrentLocale, getScopedI18n } from 'locales/server';

import { dateData } from 'helpers/dateData';

import { FilesCommentsClient } from 'components/organisms/FilesCommentsClient/FilesCommentsClient';

type CommentsType = { fileId: string };

export const FilesComments = async ({ fileId }: CommentsType) => {
  const locale = getCurrentLocale();
  const tComments = await getScopedI18n('Comments');

  const dataDateObject = await dateData();

  return (
      <FilesCommentsClient
        fileId={fileId}
        dataDateObject={dataDateObject}
        locale={locale}
        noComments={tComments('noComments')}
      />
  );
};