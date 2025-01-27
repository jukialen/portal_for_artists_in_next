'use client';

import { useState } from 'react';

import { againFilesComments } from 'utils/comments';

import { FilesCommentsType } from 'types/global.types';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { FileComment } from 'components/atoms/FileComment/FileComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FilesCommentsClient.module.scss';

type FilesCommentsClientType = {
  firstFilesComments: FilesCommentsType[];
  fileId: string;
  noComments: string;
  pseudonym: string;
};

export const FilesCommentsClient = ({
  firstFilesComments,
  fileId,
  noComments,
  pseudonym,
}: FilesCommentsClientType) => {
  const maxItems = 30;

  const [commentsArray, setCommentsArray] = useState<FilesCommentsType[]>(firstFilesComments);
  const [lastVisible, setLastVisible] = useState(
    firstFilesComments.length === maxItems ? firstFilesComments[firstFilesComments.length - 1].createdAt : '',
  );
  let [i, setI] = useState(1);

  const nextComments = async () => {
    try {
      const nextPage = await againFilesComments(fileId, maxItems);

      nextPage.length === maxItems && setLastVisible(nextPage[nextPage.length - 1].createdAt!);

      const nextArray = commentsArray.concat(...nextPage);
      setCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map(
          (
            {
              fileCommentId,
              fileId,
              content,
              authorName,
              authorProfilePhoto,
              role,
              roleId,
              authorId,
              date,
            }: FilesCommentsType,
            index,
          ) => (
            <DCProvider key={index}>
              <FileComment
                fileCommentId={fileCommentId}
                fileId={fileId}
                content={content}
                authorName={authorName}
                authorProfilePhoto={authorProfilePhoto}
                role={role}
                roleId={roleId}
                authorId={authorId}
                date={date}
                pseudonym={pseudonym}
              />
            </DCProvider>
          ),
        )
      ) : (
        <p className={styles.noComments}>{noComments}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElements={nextComments} />}
    </>
  );
};
