'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { graphics } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const PhotosGallery = ({ id, pseudonym, profilePhoto, author, tGallery, firstGraphics }: GalleryType) => {
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
        <Suspense fallback={<p>Loading...</p>}>
          {userPhotos.length > 0 ? (
            userPhotos.map(
              (
                { fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType,
                index,
              ) => (
                <Suspense key={index} fallback={<p>Loading...</p>}>
                  <FileContainer
                    fileId={fileId!}
                    name={name!}
                    fileUrl={fileUrl}
                    shortDescription={shortDescription!}
                    tags={tags!}
                    authorName={authorName!}
                    authorId={authorId}
                    authorBool={authorName === pseudonym}
                    profilePhoto={profilePhoto}
                    time={time}
                    roleId={roleId!}
                  />
                </Suspense>
              ),
            )
          ) : (
            <div>nie ma nic</div>
          )}
        </Suspense>
      </Wrapper>
      {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </article>
  );
};
