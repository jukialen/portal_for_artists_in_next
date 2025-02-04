'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { FileType, GalleryType } from 'types/global.types';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';
import { videosAnimations } from "../../../utils/files";

export const VideoGallery = ({
  id,
  author,
  pseudonym,
  profilePhoto,
  tGallery,
  firstVideos,
}: GalleryType) => {
  const maxItems = 30;

  const [userVideos, setUserVideos] = useState(firstVideos!);
  const [lastVisible, setLastVisible] = useState(
    firstVideos?.length === maxItems ? firstVideos[firstVideos!.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);

  const pathname = usePathname();

  const nextElements = async () => {
    try {
      const filesArray: FileType[] = (await videosAnimations(1, maxItems, id, 'again', lastVisible!))!;

      const nextArray = userVideos.concat([...filesArray]);
      setUserVideos(nextArray);

      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].createdAt);
        setI(i++);
      }
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
              { fileId, name, fileUrl, shortDescription, tags, authorId, authorName, time, roleId }: FileType,
              index,
            ) => (
              <Videos
                key={index}
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorId={authorId}
                authorName={authorName!}
                authorBool={authorName! === pseudonym!}
                profilePhoto={profilePhoto!}
                time={time}
                roleId={roleId!}
              />
            ),
          )
        ) : (
          <ZeroFiles text={tGallery?.noVideos!} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && (
          <MoreButton nextElements={nextElements} />
        )}
      </Wrapper>
    </article>
  );
};
