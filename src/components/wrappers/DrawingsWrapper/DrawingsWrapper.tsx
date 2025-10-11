'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

import { backUrl } from 'constants/links';
import { FileType, Tags } from 'types/global.types';

import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/wrappers/Wrapper/Wrapper';
const FileContainer = dynamic(() =>
  import('components/functional/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

type DrawingsWrapperType = {
  pid: Tags;
  pseudonym: string;
  filesDrawings: FileType[];
};

export const DrawingsWrapper = ({ pid, pseudonym, filesDrawings }: DrawingsWrapperType) => {
  const [userDrawings, setUserDrawings] = useState<FileType[]>(filesDrawings);
  const [lastVisible, setLastVisible] = useState(
    userDrawings.length > 0 ? userDrawings[userDrawings.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const maxItems = 30;

  !!userDrawings &&
    userDrawings.length === maxItems * i &&
    setLastVisible(userDrawings[userDrawings.length - 1].createdAt!);

  const nextElementsAction = async () => {
    setLoadingFiles(!loadingFiles);

    try {
      const params = { pid, maxItems: maxItems.toString(), lastVisible: lastVisible! };
      const queryString = new URLSearchParams(params).toString();

      const res: FileType[] = await fetch(`${backUrl}/api/file/next}?${queryString}`, {
        method: 'GET',
      })
        .then((r) => r.json())
        .catch((e) => console.error(e));

      const newArray = filesDrawings!.concat(...res);

      setUserDrawings(newArray);
      if (res.length === maxItems) {
        setLastVisible(res[res.length - 1].fileId!);
        setI(++i);
      }
      setLoadingFiles(!loadingFiles);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Wrapper>
      {userDrawings.length > 0 ? (
        userDrawings.map(({ fileId, name, fileUrl, shortDescription, tags, authorName, time }: FileType, index) => (
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
      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElementsAction={nextElementsAction} />
      )}
    </Wrapper>
  );
};
