'use server';

import { initialRenderedContent } from 'constants/InitialDataFiles';
import { FileType } from 'types/global.types';

interface GetMoreRenderedContentProps {
  files: FileType[];
  noEls: 1 | 2 | 3 | 4;
}

export const getMoreRenderedContent = async ({ files, noEls }: GetMoreRenderedContentProps) =>
  await initialRenderedContent(files, noEls);
