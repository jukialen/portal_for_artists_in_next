'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import { FileType, GalleryType } from 'types/global.types';

import { videosAnimations } from 'utils/files';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
const MoreButton = dynamic(() => import('components/atoms/MoreButton/MoreButton').then((mb) => mb.MoreButton), {
  ssr: false,
});
const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const VideoGallery = ({ id, pseudonym, profilePhoto, author, tGallery, firstVideos }: GalleryType) => {
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
          userVideos.map(
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

        {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
