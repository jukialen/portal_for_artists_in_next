'use client';

import { Suspense, use, useState } from 'react';
import dynamic from 'next/dynamic';

import { backUrl } from 'constants/links';
import { FileType, Tags } from 'types/global.types';

import { transAndUserData } from 'utils/users';

import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
const FileContainer = dynamic(() =>
  import('components/molecules/FileContainer/FileContainer').then((fc) => fc.FileContainer),
);

type DrawingsWrapperType = {
  pid: Tags;
  filesDrawings: FileType[];
};

export const DrawingsWrapper = ({ pid, filesDrawings }: DrawingsWrapperType) => {
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

  const userData = use(transAndUserData());

  const nextElements = async () => {
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
        userDrawings.map(
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
                authorBool={authorName === userData?.pseudonym!}
                profilePhoto={userData?.profilePhoto!}
                time={time}
                roleId={roleId!}
              />
            </Suspense>
          ),
        )
      ) : (
        <div>nie ma nic</div>
      )}
      {!!lastVisible && !!userDrawings && userDrawings.length === maxItems * i && (
        <MoreButton nextElements={nextElements} />
      )}
    </Wrapper>
  );
};
