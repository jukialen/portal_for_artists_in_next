import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

<<<<<<< Updated upstream:components/organisms/PhotosGallery/PhotosGallery.tsx
import { backUrl, cloudFrontUrl } from 'utilites/constants';
=======
import { backUrl, cloudFrontUrl } from 'src/constants/links';
>>>>>>> Stashed changes:source/components/organisms/PhotosGallery/PhotosGallery.tsx

import { FileType, UserType } from 'src/types/global.types';

import { getDate } from 'src/helpers/getDate';

<<<<<<< Updated upstream:components/organisms/PhotosGallery/PhotosGallery.tsx
import { useDateData } from 'hooks/useDateData';
=======
import { dateData } from 'src/helpers/dateData';
>>>>>>> Stashed changes:source/components/organisms/PhotosGallery/PhotosGallery.tsx

import { Wrapper } from 'src/components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'src/components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'src/components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'src/components/molecules/Article/Article';

export const PhotosGallery = ({ id, pseudonym, data }: UserType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const { asPath, locale } = useRouter();
  const dataDateObject = useDateData();

  const maxItems = 30;

  const downloadFiles = async () => {
    try {
      const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: {
              AND: [
                { tags: 'realistic' },
                { tags: 'manga' },
                { tags: 'anime' },
                { tags: 'comics' },
                { tags: 'photograpths' },
                { authorId: id },
              ],
            },
            orderBy: { name: 'desc' },
            limit: maxItems,
          },
        },
      });

      const filesArray: FileType[] = [];

      for (const file of firstPage.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          fileUrl: `https://${cloudFrontUrl}/${file.name}`,
          pseudonym,
          shortDescription,
          profilePhoto,
          authorId,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }
      setUserPhotos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!id && downloadFiles();
  }, [id]);

  const nextElements = async () => {
    try {
      const nextPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: {
              AND: [
                { tags: 'realistic' },
                { tags: 'manga' },
                { tags: 'anime' },
                { tags: 'comics' },
                { tags: 'photograpths' },
                { authorId: id },
              ],
            },
            orderBy: { name: 'desc' },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      const nextArray: FileType[] = [];

      for (const file of nextPage.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        nextArray.push({
          fileId,
          name,
          fileUrl: `https://${cloudFrontUrl}/${file.name}`,
          pseudonym,
          shortDescription,
          profilePhoto,
          authorId,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      const newArray = userPhotos.concat(...nextArray);
      setUserPhotos(newArray);
      setLastVisible(nextArray[nextArray.length - 1]);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article>
      {decodeURIComponent(asPath) === `/account/${pseudonym}` && (
        <h2 className="title">{data?.Account?.gallery?.userPhotosTitle}</h2>
      )}
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
                authorName={pseudonym!}
                profilePhoto={profilePhoto}
                authorId={authorId}
                time={time}
              />
            ),
          )
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.photos} />
        )}

        {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
