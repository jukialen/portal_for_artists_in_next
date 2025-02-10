'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { FileType, GalleryType } from 'types/global.types';

import { videosAnimations } from 'utils/files';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { AnothersWrapperContent } from 'components/Views/AnothersWrapperContent/AnothersWrapperContent';

export const VideoGallery = ({ id, author, pseudonym, profilePhoto, tGallery, firstVideos }: GalleryType) => {
  const maxItems = 30;

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
        {userVideos.length > 0 ? (
          <ClientPortalWrapper>
            <AnothersWrapperContent
              loadingFiles={loadingFiles}
              userFiles={userVideos}
              pseudonym={pseudonym!}
              profilePhoto={profilePhoto}
            />
          </ClientPortalWrapper>
        ) : (
          <ZeroFiles text={tGallery?.noVideos!} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
