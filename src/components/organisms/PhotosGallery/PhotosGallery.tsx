'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { FileType, UserType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { dateData } from 'helpers/dateData';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';

export const PhotosGallery = ({ id, pseudonym,language }: UserType) => {
  const [userPhotos, setUserPhotos] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<FileType>();
  let [i, setI] = useState(1);

  const pathname = usePathname();
  const dataDateObject = dateData();

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
          time: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
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
          time: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
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
      {decodeURIComponent(pathname!) === `/account/${pseudonym}` && (
        <h2 className="title">{language?.Account?.gallery?.userPhotosTitle}</h2>
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
          <ZeroFiles text={language?.ZeroFiles?.photos} />
        )}

        {!!lastVisible && userPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
