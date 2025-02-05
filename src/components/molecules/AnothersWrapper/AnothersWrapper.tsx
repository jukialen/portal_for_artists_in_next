'use client';

import { useState } from 'react';
import { Skeleton } from '@chakra-ui/react';

import { TagConstants } from 'constants/values';
import { FileType, IndexType } from 'types/global.types';

import { drawings } from 'utils/files';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { Article } from 'components/molecules/Article/Article';
import { Videos } from 'components/molecules/Videos/Videos';

type AnothersWrapperType = {
  index: IndexType;
  pseudonym: string;
  profilePhoto: string;
  noVideos: string;
  filesArray: FileType[];
};

export const AnothersWrapper = ({ index, pseudonym, profilePhoto, noVideos, filesArray }: AnothersWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[]>(filesArray);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [lastVisible, setLastVisible] = useState<string>(
    filesArray.length > 0 ? filesArray[filesArray.length - 1].createdAt! : '',
  );
  let [i, setI] = useState(1);

  const maxItems: number = 10;

  const nextElements = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const nextArray: FileType[] = await drawings(index, lastVisible, maxItems);

      nextArray.length === maxItems ? setLastVisible(nextArray[nextArray.length - 1].createdAt!) : setLastVisible('');

      const newArray = filesArray.concat(...nextArray);
      setUserDrawings(newArray);
      setLoadingFiles(!loadingFiles);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Wrapper>
      {userDrawings.length > 0 ? (
        userDrawings.map(
          ({ fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType, index) => (
            <Skeleton loading={loadingFiles} variant="shine" key={index}>
              {tags === TagConstants[TagConstants.findIndex((v) => v === 'videos')] ? (
                <Videos
                  fileId={fileId!}
                  name={name!}
                  fileUrl={fileUrl}
                  shortDescription={shortDescription!}
                  tags={tags}
                  authorName={authorName!}
                  authorId={authorId}
                  authorBool={authorName === pseudonym!}
                  profilePhoto={profilePhoto}
                  time={time}
                  roleId={roleId!}
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
                  authorBool={authorName === pseudonym!}
                  profilePhoto={profilePhoto}
                  time={time}
                  roleId={roleId!}
                />
              )}
            </Skeleton>
          ),
        )
      ) : (
        <ZeroFiles text={noVideos} />
      )}
      {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </Wrapper>
  );
};
