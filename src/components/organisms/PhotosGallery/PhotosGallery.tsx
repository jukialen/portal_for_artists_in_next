'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { cloudFrontUrl } from 'constants/links';
import { selectFiles } from 'constants/selects';
import { FileType, GalleryType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const PhotosGallery = ({ id, author, tGallery, locale, dataDateObject, firstGraphics }: GalleryType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>(firstGraphics!);
  const [lastVisible, setLastVisible] = useState(
    firstGraphics!.length > 0 ? firstGraphics![firstGraphics!.length - 1].fileId! : null,
  );
  let [i, setI] = useState(1);

  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const maxItems = 30;

  const nextElements = async () => {
    try {
      const nextArray: FileType[] = [];

      const { data } = await supabase
        .from('files')
        .select(selectFiles)
        .eq('authorId', id)
        .in('tags', ['realistic', 'manga', 'anime', 'comics', 'photographs'])
        .order('createdAt', { ascending: false })
        .lt('fileId', lastVisible!)
        .limit(maxItems);

      if (data?.length === 0) return userPhotos;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

        nextArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym: Users[0].pseudonym!,
          profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      const newArray = userPhotos.concat(...nextArray);
      setUserPhotos(newArray);
      setLastVisible(data?.length === 0 ? null : nextArray[nextArray.length - 1].fileId!);
      data?.length !== 0 && setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname!) === `/account/${author}` && <h2 className="title">{tGallery?.userPhotosTitle}</h2>}
      <ClientPortalWrapper>
        <Wrapper>
          {userPhotos.length > 0 ? (
            userPhotos.map(
              (
                { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
                index,
              ) => (
                <Article
                  key={index}
                  fileId={fileId!}
                  name={name!}
                  fileUrl={fileUrl}
                  shortDescription={shortDescription!}
                  tags={tags!}
                  authorName={author!}
                  profilePhoto={profilePhoto}
                  authorId={authorId}
                  time={time}
                  pseudonym={pseudonym!}
                />
              ),
            )
          ) : (
            <ZeroFiles text={tGallery?.noPhotos!} />
          )}

          {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
        </Wrapper>
      </ClientPortalWrapper>
    </article>
  );
};
