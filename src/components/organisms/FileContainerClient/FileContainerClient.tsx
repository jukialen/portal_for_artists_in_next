'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { FileType, IndexType } from 'types/global.types';

import { drawings } from 'app/actions/files';

import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

export const FileContainerClient = ({
  index,
  pseudonym,
  filesArray,
}: {
  index: IndexType;
  pseudonym: string;
  filesArray: FileType[];
}) => {
  const [newFileArray, setNewFileArray] = useState(filesArray);
  const [lastVisible, setLastVisible] = useState(
    !!filesArray && filesArray.length > 0 ? filesArray[filesArray.length - 1].name : '',
  );
  let [i, steI] = useState(1);

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
        newFileArray.map(({ fileId, name, fileUrl, shortDescription, tags, authorName, time }: FileType, index) => (
          <Suspense key={index} fallback={<p>Loading...</p>}>
            <FileContainer
              fileId={fileId!}
              name={name!}
              fileUrl={fileUrl}
              shortDescription={shortDescription!}
              tags={tags!}
              authorName={authorName!}
              authorBool={authorName === pseudonym}
              time={time}
            />
          </Suspense>
        ))
      ) : (
        <div>nie ma nic</div>
      )}

      {!!lastVisible && newFileArray.length === maxItems * i && <MoreButton nextElements={nextElements} />}
    </Wrapper>
  );
};
