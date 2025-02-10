'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { graphics } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { AnothersWrapperContent } from 'components/Views/AnothersWrapperContent/AnothersWrapperContent';

export const PhotosGallery = ({ id, author, pseudonym, profilePhoto, tGallery, firstGraphics }: GalleryType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>(firstGraphics!);
  const [lastVisible, setLastVisible] = useState(
    firstGraphics!.length > 0 ? firstGraphics![firstGraphics!.length - 1].fileId! : null,
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const pathname = usePathname();
  const maxItems = 30;

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = (await graphics(maxItems, id, 'again', lastVisible!))!;

      const newArray = userPhotos.concat(...nextArray);
      setUserPhotos(newArray);
      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].createdAt!);
        setI(++i);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname!) === `/account/${author}` && <h2 className="title">{tGallery?.userPhotosTitle}</h2>}
      <Wrapper>
        {userPhotos.length > 0 ? (
          <ClientPortalWrapper>
            <AnothersWrapperContent
              loadingFiles={loadingFiles}
              userFiles={userPhotos}
              pseudonym={pseudonym!}
              profilePhoto={profilePhoto}
            />
          </ClientPortalWrapper>
        ) : (
          <ZeroFiles text={tGallery?.noPhotos!} />
        )}

        {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
