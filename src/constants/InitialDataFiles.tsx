import { getUserData } from 'helpers/getUserData';
import { getScopedI18n } from 'locales/server';

import { FileType } from 'types/global.types';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';

export const initialRenderedContent = async (initialData: FileType[], noEls: 1 | 2 | 3 | 4) => {
  const user = await getUserData();

  const tZeroFiles = await getScopedI18n('ZeroFiles');

  const translated = [tZeroFiles('photos'), tZeroFiles('animations'), tZeroFiles('videos'), tZeroFiles('files')];

  return initialData.length > 0 ? <div></div> : <ZeroFiles text={translated[noEls - 1]} />;
};
