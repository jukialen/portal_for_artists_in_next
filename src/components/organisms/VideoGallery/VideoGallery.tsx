'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { FileType, GalleryType } from 'types/global.types';

import { getMoreRenderedContent } from '../../../app/[locale]/actions';
import { videosAnimations } from 'utils/files';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

export const VideoGallery = ({ id, author, tGallery, firstVideos, initialRenderedContentAction }: GalleryType) => {
  const maxItems = 30;

  const [renderedContent, setRenderedContent] = useState(initialRenderedContentAction);
  const [userVideos, setUserVideos] = useState(firstVideos!);
  const [lastVisible, setLastVisible] = useState(
    firstVideos?.length === maxItems ? firstVideos[firstVideos!.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const pathname = usePathname();

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const filesArray: FileType[] = (await videosAnimations(1, maxItems, id, 'again', lastVisible!))!;

      const nextArray = userVideos.concat([...filesArray]);
      setUserVideos(nextArray);

      setRenderedContent(await getMoreRenderedContent({ files: userVideos, noEls: 3 }));

      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].createdAt);
        setI(i++);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error('no your videos', e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname!) === `/account/${author}` && <h2 className="title">{tGallery?.userVideosTitle}</h2>}

      <Wrapper>
        {renderedContent}

        {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
