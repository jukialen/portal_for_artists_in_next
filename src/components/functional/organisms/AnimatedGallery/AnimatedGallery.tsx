'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { videosAnimations } from 'app/actions/files';

import { FileType, GalleryType } from 'types/global.types';

import { Wrapper } from 'components/wrappers/Wrapper/Wrapper';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
const FileContainer = dynamic(() =>
  import('components/functional/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const AnimatedGallery = ({ id, pseudonym, author, tGallery, firstAnimations }: GalleryType) => {
  const [userAnimates, setUserAnimates] = useState<FileType[]>(firstAnimations!);
  const [lastVisible, setLastVisible] = useState(
    firstAnimations!.length > 0 ? firstAnimations![firstAnimations!.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const pathname = usePathname();
  const maxItems = 30;

  const nextElementsAction = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = (await videosAnimations(0, maxItems, id, 'again', lastVisible!))!;

      const newArray = userAnimates.concat(...nextArray);
      setUserAnimates(newArray);

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
        {userAnimates.length > 0 ? (
          userAnimates.map(({ fileId, name, fileUrl, shortDescription, tags, authorName, time }: FileType, index) => (
            <Suspense key={index} fallback={<p>Loading...</p>}>
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

        {!!lastVisible && userAnimates.length === maxItems * i && (
          <MoreButton nextElementsAction={nextElementsAction} />
        )}
      </Wrapper>
    </article>
  );
};
