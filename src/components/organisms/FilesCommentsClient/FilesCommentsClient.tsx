'use client';

import { useState } from 'react';

import { backUrl } from 'constants/links';
import { DateObjectType, FilesCommentsType } from 'types/global.types';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { FileComment } from 'components/atoms/FileComment/FileComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FilesCommentsClient.module.scss';

type FilesCommentsClientType = {
  filesFilesComments: FilesCommentsType[];
  fileId: string;
  dataDateObject: DateObjectType;
  noComments: string;
  pseudonym: string;
  profilePhoto: string;
};
export const FilesCommentsClient = ({
  filesFilesComments,
  fileId,
  noComments,
  pseudonym,
  profilePhoto,
}: FilesCommentsClientType) => {
  const [commentsArray, setCommentsArray] = useState<FilesCommentsType[]>(filesFilesComments);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const maxItems = 30;

  const nextComments = async () => {
    try {
      const params = encodeURI(
        JSON.stringify({
          fileId,
          maxItems,
          cursor: lastVisible,
        }),
      );

      const nextPage: FilesCommentsType[] = await fetch(`${backUrl}/files-comments?${params}`, {
        method: 'GET',
      }).then((data) => data.json());
      
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
            { fileCommentId, fileId, comment, authorName, authorProfilePhoto, role, roleId, authorId, date }: FilesCommentsType,
            index,
          ) => (
            <DCProvider key={index}>
              <FileComment
                fileCommentId={fileCommentId}
                fileId={fileId}
                comment={comment}
                authorName={authorName}
                authorProfilePhoto={authorProfilePhoto}
                role={role}
                roleId={roleId}
                authorId={authorId}
                date={date}
                pseudonym={pseudonym}
                profilePhoto={profilePhoto}
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
