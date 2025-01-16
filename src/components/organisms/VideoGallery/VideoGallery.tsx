'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Database } from 'types/database.types';
import { DateObjectType, FileType, GalleryType, LangType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Videos } from 'components/molecules/Videos/Videos';
import { selectFiles } from 'constants/selects';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const VideoGallery = ({
  id,
  author,
  pseudonym,
  profilePhoto,
  tGallery,
  locale,
  dataDateObject,
  firstVideos,
}: GalleryType) => {
  const maxItems = 30;

  const [userVideos, setUserVideos] = useState(firstVideos!);
  const [lastVisible, setLastVisible] = useState(
    firstVideos?.length === maxItems ? firstVideos[firstVideos!.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);

  const pathname = usePathname();
  const supabase = createClientComponentClient<Database>();

  const nextElements = async (locale: LangType, maxItems: number, dataDateObject: DateObjectType) => {
    try {
      const filesArray: FileType[] = [];

      const { data } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', id)
        .eq('tags', 'videos')
        .gt('createdAt', lastVisible)
        .order('createdAt', { ascending: false })
        .limit(maxItems);

      if (data?.length === 0) return filesArray;

      for (const file of data!) {
        const { fileId, name, tags, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          fileUrl,
          authorId: authorId!,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          tags,
        });
      }

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
            ({ fileId, name, fileUrl, shortDescription, tags, authorId, authorName, time }: FileType, index) => (
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
              />
            ),
          )
        ) : (
          <ZeroFiles text={tGallery?.noVideos!} />
        )}

        {!!lastVisible && userVideos.length === maxItems * i && (
          <MoreButton nextElements={() => nextElements(locale, maxItems, dataDateObject)} />
        )}
      </Wrapper>
    </article>
  );
};
