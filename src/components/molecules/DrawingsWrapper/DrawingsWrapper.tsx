'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { FileType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

type DrawingsWrapperType = {
  locale: string;
  pid: string;
  dataDateObject: { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };
  noDrawings: string;
};

export const DrawingsWrapper = ({ locale, pid, dataDateObject, noDrawings }: DrawingsWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const maxItems = 30;

  const downloadDrawings = async () => {
    try {
      const filesArray: FileType[] = [];

      const firstPage: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { createdAt: 'desc' },
            where: { tags: pid },
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
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setUserDrawings(filesArray);
      filesArray.length === maxItems && setLastVisible(filesArray[filesArray.length - 1].fileId);
    } catch (e) {
      console.error(e);
      console.log('No such drawings!');
    }
  };
  
  const nextElements = async () => {
    try {
      const filesArray: FileType[] = [];

      const nextArray: { data: FileType[] } = await axios.get(`${backUrl}/files/all`, {
        params: {
          queryData: {
            orderBy: { createdAt: 'desc' },
            where: { tags: pid },
            limit: maxItems,
            cursor: lastVisible,
          },
        },
      });

      for (const file of nextArray.data) {
        const { fileId, name, shortDescription, pseudonym, profilePhoto, authorId, createdAt, updatedAt } = file;

        filesArray.push({
          fileId,
          name,
          shortDescription,
          pseudonym,
          profilePhoto,
          fileUrl: `https://${cloudFrontUrl}/${name}`,
          authorId,
          time: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setLastVisible(filesArray[filesArray.length - 1].fileId);
      const newArray = userDrawings.concat(...filesArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!pid && downloadDrawings();
  }, [pid]);

  return (
    <>
      {userDrawings.length > 0 ? (
        userDrawings.map(
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
        <ZeroFiles text={noDrawings} />
      )}

      {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
