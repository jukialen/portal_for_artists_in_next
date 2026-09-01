'use client';

import { useEffect, useState } from 'react';

import { useScopedI18n } from 'locales/client';

import { CommentsColumnIds, CommentType } from 'types/global.types';

import { comments } from 'app/actions/comments';

import { Comment } from 'components/functional/atoms/Comment/Comment';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';

import styles from './Comments.module.css';

export const Comments = ({
  commentId,
  fileCommentId,
  subCommentId,
  lastCommentId,
  postId,
  fileId,
  roleId,
  newReply,
}: CommentsColumnIds) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  const [i, setI] = useState(1);

  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    comments({
      maxItems,
      postId,
      commentId,
      fileCommentId,
      subCommentId,
      lastCommentId,
      fileId,
      lastVisible,
      groupsPostsRoleId: roleId,
    }).then((t) => {
      setCommentsArray(t!);
      !!t && t.length === maxItems && setLastVisible(t[t.length - 1].createdAt!);
    });
  }, []);

  useEffect(() => {
    if (newReply) {
      setCommentsArray((prev) => [newReply, ...prev]);
      setI((prevI) => (commentsArray.length >= maxItems * prevI ? prevI + 1 : prevI));
    }
  }, [newReply]);

  const nextComments = () =>
    lastVisible !== '' &&
    comments({
      maxItems,
      step: 'again',
      postId,
      commentId,
      fileCommentId,
      subCommentId,
      lastCommentId,
      fileId,
      lastVisible,
      groupsPostsRoleId: roleId,
    }).then((t) => {
      const nextArray = commentsArray.concat(...t!);

      setCommentsArray(nextArray);
      if (t!.length === maxItems) {
        setLastVisible(t![t!.length - 1].createdAt!);
        setI((prev) => prev + 1);
      }
    });

  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map((comment: CommentType, index) => <Comment commentData={{ ...comment, roleId }} key={index} />)
      ) : postId ? (
        <p className={styles.noComments}>{tComments('noComments')}</p>
      ) : (
        <></>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
    </>
  );
};
