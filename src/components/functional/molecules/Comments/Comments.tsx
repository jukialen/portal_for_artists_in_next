'use client';

import { useEffect, useState } from 'react';

import { useScopedI18n } from 'locales/client';

import { CommentsColumnIds, CommentType } from 'types/global.types';

import { comments } from 'utils/comments';

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
}: CommentsColumnIds) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    comments(maxItems, postId, commentId, fileCommentId, subCommentId, lastCommentId, fileId, lastVisible, roleId).then(
      (t) => {
        setCommentsArray(t!);
        !!t && t.length === maxItems && setLastVisible(t[t.length - 1].createdAt!);
      },
    );
  }, [postId, roleId, commentId, fileCommentId, subCommentId, lastCommentId, fileId]);

  const nextComments = () =>
    lastVisible !== '' &&
    comments(
      maxItems,
      postId,
      commentId,
      fileCommentId,
      subCommentId,
      lastCommentId,
      fileId,
      lastVisible,
      roleId,
      'again',
    ).then((t) => {
      const nextArray = commentsArray.concat(...t!);

      setCommentsArray(nextArray);
      if (t!.length === maxItems) {
        setLastVisible(t![t!.length - 1].postId!);
        setI((prev) => prev + 1);
      }
    });

  const handleAddReply = (newReply: CommentType) => {
    // Dodajesz odpowiedź do listy podkomentarzy
    setCommentsArray((prev) => [...prev, newReply]);
  };

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
