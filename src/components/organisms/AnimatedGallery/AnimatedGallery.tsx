'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { videosAnimations } from 'utils/files';

import { FileType, GalleryType } from 'types/global.types';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ id, author, pseudonym, profilePhoto, tGallery, firstAnimations }: GalleryType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>(firstAnimations!);
  const [lastVisible, setLastVisible] = useState<string | null>();
  let [i, setI] = useState(1);

  const pathname = usePathname();
  const maxItems = 30;

  const nextElements = async () => {
    try {
      const nextArray: FileType[] = (await videosAnimations(0, maxItems, id, 'again', lastVisible!))!;

      const newArray = userAnimatedPhotos.concat(...nextArray);
      setUserAnimatedPhotos(newArray);
      if (nextArray.length === maxItems) {
        setLastVisible(nextArray[nextArray.length - 1].createdAt);
        setI(i++);
      }
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname) === `/account/${author}` && (
        <h2 className="title">{tGallery?.userAnimationsTitle}</h2>
      )}

      <ClientPortalWrapper>
        <Wrapper>
          {userAnimatedPhotos.length > 0 ? (
            userAnimatedPhotos.map(
              ({ fileId, name, fileUrl, shortDescription, tags, authorId, time, roleId }: FileType, index) => (
                <Article
                  key={index}
                  fileId={fileId!}
                  name={name!}
                  fileUrl={fileUrl}
                  shortDescription={shortDescription!}
                  tags={tags!}
                  authorName={pseudonym!}
                  authorId={authorId}
                  authorBool={author === pseudonym!}
                  profilePhoto={profilePhoto!}
                  time={time}
                  roleId={roleId!}
                />
              ),
            )
          ) : (
            <ZeroFiles text={tGallery?.noAnimations!} />
          )}

          {!!lastVisible && userAnimatedPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
        </Wrapper>
      </ClientPortalWrapper>
    </article>
  );
};
