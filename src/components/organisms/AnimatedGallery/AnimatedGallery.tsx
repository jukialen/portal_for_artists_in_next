'use client';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { videosAnimations } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);
export const AnimatedGallery = ({ id, pseudonym, profilePhoto, author, tGallery, firstAnimations }: GalleryType) => {
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
        <Suspense fallback={<p>Loading...</p>}>
          {userAnimates.length > 0 ? (
            userAnimates.map(
              (
                { fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType,
                index,
              ) => (
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
              ),
            )
          ) : (
            <div>nie ma nic</div>
          )}
        </Suspense>

        {!!lastVisible && userAnimates.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
