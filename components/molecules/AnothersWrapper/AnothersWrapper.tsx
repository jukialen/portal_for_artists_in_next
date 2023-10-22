'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@chakra-ui/react';

import { FileType, Tags } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

type AnothersWrapperType = {
  locale: string;
  index: string;
  dataDateObject: { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };
  noVideos: string;
};

export const AnothersWrapper = ({ locale, index, dataDateObject, noVideos }: AnothersWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const maxItems: number = 10;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];
      const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { name: 'desc' },
            where: { tags: index },
            limit: maxItems,
          },
        },
      });

      for (const file of firstPage.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(locale, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setUserDrawings(filesArray);
      setLoadingFiles(true);
    } catch (e) {
      console.error('Error', e);
      console.error('No such document!');
    }
  };

  useEffect(() => {
    !!index && downloadDrawings();
  }, [index]);

  const nextElements = async () => {
    try {
      const nextArray: FileType[] = [];
      const nextPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { name: 'desc' },
            where: { tags: index },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      for (const file of nextPage.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        nextArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(locale, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setLastVisible(nextArray[nextArray.length - 1].fileId);
      const newArray = userDrawings.concat(...nextArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {userDrawings.length > 0 ? (
        userDrawings.map(
          (
            { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
            index,
          ) => (
            <Skeleton isLoaded={loadingFiles} key={index}>
              {tags === Tags.videos ? (
                <Videos
                  fileId={fileId!}
                  name={name!}
                  fileUrl={fileUrl}
                  shortDescription={shortDescription!}
                  tags={tags}
                  authorName={pseudonym!}
                  profilePhoto={profilePhoto}
                  authorId={authorId}
                  time={time}
                />
              ) : (
                <Article
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
              )}
            </Skeleton>
          ),
        )
      ) : (
        <ZeroFiles text={noVideos} />
      )}
      {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
