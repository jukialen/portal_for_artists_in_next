'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { graphics } from 'app/actions/files';

import { FileType, GalleryType } from 'types/global.types';

import { Wrapper } from 'components/wrappers/Wrapper/Wrapper';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
const FileContainer = dynamic(() =>
  import('components/functional/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const PhotosGallery = ({ id, pseudonym, author, tGallery, firstGraphics }: GalleryType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>(firstGraphics!);
  const [lastVisible, setLastVisible] = useState(
    !!firstGraphics && firstGraphics!.length > 0 ? firstGraphics![firstGraphics!.length - 1].fileId! : null,
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const pathname = usePathname();
  const maxItems = 30;

  const nextElementsAction = async () => {
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
        {userPhotos && userPhotos.length > 0 ? (
          userPhotos.map(({ fileId, name, fileUrl, shortDescription, tags, authorName, time }: FileType, index) => (
            <Suspense key={index} fallback="Loading...">
              <FileContainer
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={authorName!}
                authorBool={authorName === pseudonym}
                time={time}
              />
            </Suspense>
          ))
        ) : (
          <div>nie ma nic</div>
        )}
      </Wrapper>
      {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElementsAction={nextElementsAction} />}
    </article>
  );
};
