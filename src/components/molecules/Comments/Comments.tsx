'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

import { useCurrentLocale, useScopedI18n } from "locales/client";

import { CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';
import { dateData } from 'helpers/dateData';
import { backUrl, cloudFrontUrl } from 'constants/links';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/atoms/Comment/Comment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Comments.module.scss';

type CommentsType = { postId: string };

export const Comments = ({ postId }: CommentsType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const locale = useCurrentLocale();
  const tComments = useScopedI18n('Comments');
  
  const dataDateObject = dateData();

  const maxItems = 30;

  const firstComments = async () => {
    try {
      const firstPage: { data: CommentType[] } = await axios.get(`${backUrl}/comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { postId },
          limit: maxItems,
        },
      });

      const commentArray: CommentType[] = [];

      for (const first of firstPage.data) {
        const { commentId, comment, Users, role, roleId, authorId, groupRole, createdAt, updatedAt } =
          first;

        commentArray.push({
          commentId,
          comment,
          authorName: Users[0].pseudonym!,
          authorProfilePhoto: `https://${cloudFrontUrl}/${Users[0].profilePhoto!}`,
          role,
          roleId,
          authorId,
          groupRole,
          date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        });
      }

      setCommentsArray(commentArray);
      commentArray.length === maxItems && setLastVisible(commentArray[commentArray.length - 1].postId!);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!postId && firstComments();
  }, [postId]);

  const nextComments = async () => {
    try {
      const nextPage: { data: CommentType[] } = await axios.get(`${backUrl}/comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: { postId },
          limit: maxItems,
          cursor: lastVisible,
        },
      });

      const nextCommentArray: CommentType[] = [];

      for (const next of nextPage.data) {
        const {
          commentId,
          comment,
          authorName,
          authorProfilePhoto,
          role,
          roleId,
          authorId,
          groupRole,
          createdAt,
          updatedAt,
          postId,
        } = next;

        nextCommentArray.push({
          commentId,
          comment,
          authorName,
          authorProfilePhoto: `https://${cloudFrontUrl}/${authorProfilePhoto}`,
          role,
          roleId,
          authorId,
          groupRole,
          postId,
          date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
        });
      }

      nextPage.data.length === maxItems && setLastVisible(nextCommentArray[nextCommentArray.length - 1].postId!);

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
              authorName,
              authorProfilePhoto,
              role,
              roleId,
              authorId,
              groupRole,
              postId,
              date,
            }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <Comment
                commentId={commentId}
                comment={comment}
                authorName={authorName}
                authorProfilePhoto={authorProfilePhoto}
                role={role}
                roleId={roleId}
                groupRole={groupRole}
                authorId={authorId}
                postId={postId}
                date={date}
              />
            </DCProvider>
          ),
        )
      ) : (
        <p className={styles.noComments}>{tComments('noComments')}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElements={nextComments} />}
    </>
  );
};
