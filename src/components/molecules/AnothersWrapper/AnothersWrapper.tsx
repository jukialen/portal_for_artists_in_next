'use client';

import { useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@chakra-ui/react';

import { FileType, IndexType, LangType, Tags, UserType } from "types/global.types";

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

type AnothersWrapperType = {
  locale: LangType;
  index: IndexType;
  dataDateObject: { second: string; minute: string; hour: string; day: string; yearDateSeparator: string };
  noVideos: string;
  filesArray: FileType[];
  userData: UserType;
};

export const AnothersWrapper = ({
  locale,
  index,
  dataDateObject,
  noVideos,
  filesArray,
  userData,
}: AnothersWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const maxItems: number = 10;

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
      const newArray = filesArray.concat(...nextArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {filesArray.length > 0 ? (
        filesArray.map(
          (
            { fileId, name, fileUrl, shortDescription, tags, pseudonym, profilePhoto, authorId, time }: FileType,
            index,
          ) => (
            <Skeleton isLoaded={loadingFiles} key={index}>
              <ClientPortalWrapper>
                {tags === Tags.videos ? (
                  <Videos
                    fileId={fileId!}
                    name={name!}
                    fileUrl={fileUrl}
                    shortDescription={shortDescription!}
                    tags={tags}
                    authorName={pseudonym!}
                    pseudonym={pseudonym!}
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
                    authorId={authorId}
                    pseudonym={pseudonym!}
                    profilePhoto={profilePhoto}
                    time={time}
                  />
                  )}
              </ClientPortalWrapper>
            </Skeleton>
          ),
        )
      ) : (
        <ZeroFiles text={noVideos} />
      )}
      {!!lastVisible && filesArray.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
