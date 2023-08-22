import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from 'url';

import { backUrl } from 'utilites/constants';

import { CommentType, FilesCommentsType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/atoms/Comment/Comment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './FilesComments.module.scss';

type CommentsType = { fileId: string };

export const FilesComments = ({ fileId }: CommentsType) => {
  const [commentsArray, setCommentsArray] = useState<FilesCommentsType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const data = useHookSWR();
  const dataDateObject = useDateData();

  const maxItems = 30;

  const firstComments = async () => {
    const queryParams = {
      orderBy: 'createdAt, desc',
      where: `{ fileId: ${fileId}}`,
      limit: maxItems.toString(),
    };

    const params = new url.URLSearchParams(queryParams);

    try {
      const firstPage: FilesCommentsType[] = await axios.get(`${backUrl}/comments/all?${params}`);

      const commentArray: FilesCommentsType[] = [];

      for (const first of firstPage) {
        const {
          fileId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          adModRoleId,
          authorId,
          groupRole,
          createdAt,
          updatedAt,
        } = first;

        commentArray.push({
          fileId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          adModRoleId,
          authorId,
          groupRole,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      setCommentsArray(commentArray);
      commentArray.length === maxItems && setLastVisible(commentArray[commentArray.length - 1].postId!);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!fileId && firstComments();
  }, [fileId]);

  const nextComments = async () => {
    const queryParamsWithCursor = {
      orderBy: 'createdAt, desc',
      where: `{ fileId: ${fileId}}`,
      limit: maxItems.toString(),
      cursor: lastVisible,
    };
    const paramsWithCursor = new url.URLSearchParams(queryParamsWithCursor);

    try {
      const nextPage: FilesCommentsType[] = await axios.get(`${backUrl}/files-comments/all?${paramsWithCursor}`);

      const nextCommentArray: FilesCommentsType[] = [];

      for (const next of nextPage) {
        const {
          fileId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          adModRoleId,
          authorId,
          groupRole,
          createdAt,
          updatedAt,
        } = next;

        nextCommentArray.push({
          commentId,
          comment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          adModRoleId,
          authorId,
          groupRole,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      nextPage.length === maxItems && setLastVisible(nextCommentArray[nextCommentArray.length - 1].postId!);

      const nextArray = commentsArray.concat(...nextCommentArray);
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
              commentId,
              comment,
              pseudonym,
              profilePhoto,
              role,
              roleId,
              adModRoleId,
              authorId,
              groupRole,
              date,
            }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <Comment
                commentId={commentId}
                comment={comment}
                pseudonym={pseudonym}
                profilePhoto={profilePhoto}
                role={role}
                roleId={roleId}
                groupRole={groupRole}
                adModRoleId={adModRoleId}
                authorId={authorId}
                date={date}
              />
            </DCProvider>
          ),
        )
      ) : (
        <p className={styles.noComments}>{data?.Comments?.noComments}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElements={nextComments} />}
    </>
  );
};
