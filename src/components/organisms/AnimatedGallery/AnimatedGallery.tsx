'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { videosAnimations } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { getMoreRenderedContent } from '../../../app/[locale]/actions';

export const AnimatedGallery = ({
  id,
  author,
  tGallery,
  firstAnimations,
  initialRenderedContentAction,
}: GalleryType) => {
  const [renderedContent, setRenderedContent] = useState(initialRenderedContentAction);
  const [userAnimates, setUserAnimates] = useState<FileType[]>(firstAnimations!);
  const [lastVisible, setLastVisible] = useState(
    firstAnimations!.length > 0 ? firstAnimations![firstAnimations!.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const pathname = usePathname();
  const maxItems = 30;

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = (await videosAnimations(0, maxItems, id, 'again', lastVisible!))!;

      const newArray = userAnimates.concat(...nextArray);
      setUserAnimates(newArray);

      setRenderedContent(await getMoreRenderedContent({ files: userAnimates, noEls: 2 }));

      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].createdAt);
        setI(i++);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname) === `/account/${author}` && (
        <h2 className="title">{tGallery?.userAnimationsTitle}</h2>
      )}

      <Wrapper>
        {renderedContent}

        {!!lastVisible && userAnimates.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
