'use client';

import { Suspense, use, useState } from 'react';
import dynamic from 'next/dynamic';

import { FileType, IndexType } from 'types/global.types';

import { drawings } from 'utils/files';
import { transAndUserData } from 'utils/users';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const FileContainerClient = ({ index, filesArray }: { index: IndexType; filesArray: FileType[] }) => {
  const [newFileArray, setNewFileArray] = useState(filesArray);
  const [lastVisible, setLastVisible] = useState(
    !!filesArray && filesArray.length > 0 ? filesArray[filesArray.length - 1].name : '',
  );
  let [i, steI] = useState(1);
  const userData = use(transAndUserData());

  const maxItems = 30;

  const nextElements = async () => {
    try {
      const nextArray: FileType[] = await drawings(index, lastVisible!, maxItems);

      nextArray.length === maxItems ? setLastVisible(nextArray[nextArray.length - 1].createdAt!) : setLastVisible('');

      const newArray = filesArray.concat(...nextArray);
      setNewFileArray(newArray);
      steI(++i);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Wrapper>
      {newFileArray.length > 0 ? (
        newFileArray.map(
          ({ fileId, name, fileUrl, shortDescription, tags, authorName, authorId, time, roleId }: FileType, index) => (
            <Suspense key={index} fallback={<p>Loading...</p>}>
              <FileContainer
                fileId={fileId!}
                name={name!}
                fileUrl={fileUrl}
                shortDescription={shortDescription!}
                tags={tags!}
                authorName={authorName!}
                authorId={authorId}
                authorBool={authorName === userData.pseudonym}
                profilePhoto={userData.profilePhoto}
                time={time}
                roleId={roleId!}
              />
            </Suspense>
          ),
        )
      ) : (
        <div>nie ma nic</div>
      )}

      {!!lastVisible && newFileArray.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </Wrapper>
  );
};
