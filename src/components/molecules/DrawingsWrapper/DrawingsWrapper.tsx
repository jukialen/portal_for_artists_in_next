'use client';

import { ReactNode, useState } from 'react';

import { backUrl } from 'constants/links';
import { FileType, Tags } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { getMoreRenderedContent } from '../../../app/[locale]/actions';

type DrawingsWrapperType = {
  pid: Tags;
  filesDrawings: FileType[];
  initialRenderedContentAction: () => ReactNode;
};

export const DrawingsWrapper = ({ pid, filesDrawings, initialRenderedContentAction }: DrawingsWrapperType) => {
  const [renderedContent, setRenderedContent] = useState(initialRenderedContentAction);
  const [userDrawings, setUserDrawings] = useState<FileType[]>(filesDrawings);
  const [lastVisible, setLastVisible] = useState(
    userDrawings.length > 0 ? userDrawings[userDrawings.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const maxItems = 30;

  !!userDrawings &&
    userDrawings.length === maxItems &&
    setLastVisible(userDrawings[userDrawings.length - 1].createdAt!);

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const params = { pid, maxItems: maxItems.toString(), lastVisible: lastVisible! };
      const queryString = new URLSearchParams(params).toString();

      const res: FileType[] = await fetch(`${backUrl}/api/file/next}?${queryString}`, {
        method: 'GET',
      })
        .then((r) => r.json())
        .catch((e) => console.error(e));

      const newArray = filesDrawings!.concat(...res);

      setRenderedContent(await getMoreRenderedContent({ files: newArray, noEls: 1 }));
      setUserDrawings(newArray);
      if (res.length === maxItems) {
        setLastVisible(res[res.length - 1].fileId!);
        setI(++i);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {renderedContent}
      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElements={nextElements} />
      )}
    </>
  );
};
