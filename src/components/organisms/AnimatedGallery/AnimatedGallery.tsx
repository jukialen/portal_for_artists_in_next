'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { videosAnimations } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { AnothersWrapperContent } from 'components/Views/AnothersWrapperContent/AnothersWrapperContent';

export const AnimatedGallery = ({ id, author, pseudonym, profilePhoto, tGallery, firstAnimations }: GalleryType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>(firstAnimations!);
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

      const newArray = userAnimatedPhotos.concat(...nextArray);
      setUserAnimatedPhotos(newArray);
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
        {userAnimatedPhotos.length > 0 ? (
          <ClientPortalWrapper>
            <AnothersWrapperContent
              loadingFiles={loadingFiles}
              userFiles={userAnimatedPhotos}
              pseudonym={pseudonym!}
              profilePhoto={profilePhoto}
            />
          </ClientPortalWrapper>
        ) : (
          <ZeroFiles text={tGallery?.noAnimations!} />
        )}

        {!!lastVisible && userAnimatedPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
