'use client';

import { useState } from 'react';

import { FileType, IndexType } from 'types/global.types';

import { drawings } from 'utils/files';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { ClientPortalWrapper } from 'components/atoms/ClientPortalWrapper/ClientPortalWrapper';
import { AnothersWrapperContent } from 'components/Views/AnothersWrapperContent/AnothersWrapperContent';

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
    <>
      {userDrawings.length > 0 ? (
        <ClientPortalWrapper>
          {/*<AnothersWrapperContent*/}
          {/*  loadingFiles={loadingFiles}*/}
          {/*  userFiles={userDrawings}*/}
          {/*  pseudonym={pseudonym}*/}
          {/*  profilePhoto={profilePhoto}*/}
          {/*/>*/}
          <div></div>
        </ClientPortalWrapper>
      ) : (
        <ZeroFiles text={noVideos} />
      )}
      {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </>
  );
};
