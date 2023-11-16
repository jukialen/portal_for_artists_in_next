'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { FileType, UserType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { dateData } from 'helpers/dateData';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

export const AnimatedGallery = ({ id, pseudonym, language }: UserType) => {
  // const [userAnimatedPhotos, setUserAnimatedPhotos] = useState<FileType[]>([]);
  // const [lastVisible, setLastVisible] = useState<FileType>();
  // let [i, setI] = useState(1);

  // const { pathname, locale } = useRouter();
  // const dataDateObject = dateData();

  const maxItems = 30;

  const downloadAnimations = async () => {
    try {
      const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: {
              AND: [{ tags: 'animations' }, { ownerFile: id }],
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

      setUserAnimatedPhotos(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1]);
    } catch (e) {
      console.log('No such document!', e);
    }
  };

  useEffect(() => {
    !!id && downloadAnimations();
  }, [id]);

  const nextElements = async () => {
    try {
      const nextPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            where: {
              AND: [{ tags: 'animations' }, { ownerFile: id }],
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
      const newArray = userAnimatedPhotos.concat(...nextArray);
      setLastVisible(newArray[newArray.length - 1]);
      setUserAnimatedPhotos(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article>
      {decodeURIComponent(pathname) === `/account/${pseudonym}` && (
        <h2 className="title">{language?.Account?.gallery?.userAnimationsTitle}</h2>
      )}

      <Wrapper>
        {userAnimatedPhotos.length > 0 ? (
          userAnimatedPhotos.map(
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
          <ZeroFiles text={language?.ZeroFiles?.animations} />
        )}

        {!!lastVisible && userAnimatedPhotos.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </article>
  );
};
