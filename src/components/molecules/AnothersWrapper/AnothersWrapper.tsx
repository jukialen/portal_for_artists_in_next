'use client';

import { ReactNode, useState } from 'react';

import { FileType, IndexType } from 'types/global.types';

import { drawings } from 'utils/files';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { getMoreRenderedContent } from '../../../app/[locale]/actions';

type AnothersWrapperType = {
  index: IndexType;
  pseudonym: string;
  profilePhoto: string;
  noVideos: string;
  filesArray: FileType[];
  initialRenderedContentAction: () => ReactNode;
};

export const AnothersWrapper = ({
  index,
  pseudonym,
  profilePhoto,
  noVideos,
  filesArray,
  initialRenderedContentAction,
}: AnothersWrapperType) => {
  const [renderedContent, setRenderedContent] = useState(initialRenderedContentAction);
  const [userDrawings, setUserDrawings] = useState<FileType[]>(filesArray);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastVisible, setLastVisible] = useState<string>(
    filesArray.length > 0 ? filesArray[filesArray.length - 1].createdAt! : '',
  );
  let [i, setI] = useState(1);

  const maxItems: number = 10;

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = await drawings(index, lastVisible, maxItems);

      nextArray.length === maxItems ? setLastVisible(nextArray[nextArray.length - 1].createdAt!) : setLastVisible('');

      const newArray = filesArray.concat(...nextArray);
      setUserDrawings(newArray);
      setRenderedContent(await getMoreRenderedContent({ files: userDrawings, noEls: 1 }));
      setLoadingFiles(!loadingFiles);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {renderedContent}
      {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
