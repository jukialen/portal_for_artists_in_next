'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { selectFiles } from 'constants/selects';
import { Database } from 'types/database.types';
import { FileType, GalleryType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { getFileRoleId } from 'utils/roles';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({
  id,
  author,
  pseudonym,
  profilePhoto,
  tGallery,
  locale,
  dataDateObject,
  firstAnimations,
}: GalleryType) => {
  const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>(firstAnimations!);
  const [lastVisible, setLastVisible] = useState<string | null>();
  let [i, setI] = useState(1);

  const pathname = usePathname();
  const maxItems = 30;
  const supabase = createClientComponentClient<Database>();

  const nextElements = async () => {
    try {
      const nextArray: FileType[] = [];

      const { data } = await supabase
        .from('Files')
        .select(selectFiles)
        .eq('authorId', id)
        .eq('tags', 'animations')
        .order('createdAt', { ascending: false })
        .lt('createdAt', lastVisible)
        .limit(maxItems);

      if (data?.length === 0) return userAnimatedPhotos;

      for (const file of data!) {
        const { fileId, name, tags, shortDescription, Users, authorId, fileUrl, createdAt, updatedAt } = file;

        const roleId = await getFileRoleId(fileId, authorId!);

        nextArray.push({
          fileId,
          name,
          shortDescription: shortDescription!,
          authorName: Users?.pseudonym!,
          fileUrl,
          authorId: authorId!,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
          tags,
          roleId: roleId!,
        });
      }

      const newArray = userAnimatedPhotos.concat(...nextArray);
      nextArray.length === maxItems && setLastVisible(nextArray[nextArray.length - 1].createdAt);
      setUserAnimatedPhotos(newArray);
      setI(++i);
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
