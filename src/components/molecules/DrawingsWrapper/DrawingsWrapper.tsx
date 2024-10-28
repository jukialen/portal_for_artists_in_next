'use client';

import { useState } from 'react';
import axios from 'axios';

import { DateObjectType, FileType, LangType } from "types/global.types";

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';
import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';

type DrawingsWrapperType = {
  locale: LangType;
  pid: string;
  dataDateObject: DateObjectType;
  noDrawings: string;
  filesDrawings: FileType[] | undefined;
};

export const DrawingsWrapper =  async ({ locale, pid, dataDateObject, noDrawings, filesDrawings }: DrawingsWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[] | undefined>(filesDrawings);
  const [lastVisible, setLastVisible] = useState<string | null>(null);
  let [i, setI] = useState(1);

  const maxItems = 30;
  
  
  !!userDrawings && userDrawings.length === maxItems && setLastVisible(userDrawings[userDrawings.length - 1].fileId!);
  
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

      setLastVisible(filesArray[filesArray.length - 1].fileId!);
      const newArray = filesDrawings!.concat(...filesArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {!!userDrawings && userDrawings.length > 0 ? (
        userDrawings.map(
          (
            { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
            index,
          ) => (
            <ClientPortalWrapper key={index}>
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
                pseudonym={pseudonym!}
              />
            </ClientPortalWrapper>
          ),
        )
      ) : (
        <ZeroFiles text={noDrawings} />
      )}

      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
