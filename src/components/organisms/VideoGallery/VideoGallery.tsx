'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { DateObjectType, FileType, GalleryType, LangType } from 'types/global.types';

import { cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';
import { selectFiles } from 'constants/selects';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const VideoGallery = ({ id, author, tGallery, locale, dataDateObject, firstVideos }: GalleryType) => {
  const [userVideos, setUserVideos] = useState(firstVideos!);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const pathname = usePathname();

  const maxItems = 30;

  const supabase = createClientComponentClient();
  const nextElements = async (locale: LangType, maxItems: number, authorId: string, dataDateObject: DateObjectType) => {
    try {
      const filesArray: FileType[] = [];

      const { data } = await supabase
        .from('files')
        .select(selectFiles)
        .eq('authorId', id)
        .eq('tags', 'videos')
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0) return filesArray;

      for (const file of data!) {
        const { fileId, name, shortDescription, Users, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym: Users[0].pseudonym!,
          profilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          createdAt,
          updatedAt,
        });
      }
      return filesArray;
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
              {
                fileId,
                name,
                fileUrl,
                shortDescription,
                tags,
                authorId,
                authorName,
                pseudonym,
                profilePhoto,
                time,
              }: FileType,
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
                profilePhoto={profilePhoto}
                pseudonym={pseudonym!}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={tGallery?.noVideos!} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && <MoreButton nextElements={() => nextElements(locale, maxItems, id, dataDateObject)} />}
      </Wrapper>
    </article>
  );
};
