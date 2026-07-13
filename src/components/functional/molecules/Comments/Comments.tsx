'use client';

import { useEffect, useState } from 'react';

import { useScopedI18n } from 'locales/client';

import { CommentType } from 'types/global.types';

import { comments } from 'utils/comments';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/functional/atoms/Comment/Comment';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';

import styles from './Comments.module.css';

type CommentsType = { postId: string; roleId: string };

export const Comments = ({ postId, roleId }: CommentsType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    comments(postId, maxItems, roleId, 'first').then((t) => {
      setCommentsArray(t!);
      !!t && t.length === maxItems && setLastVisible(t[t.length - 1].postId!);
    });
  }, [postId, roleId]);

  const nextComments = () =>
    lastVisible !== '' &&
    comments(postId, maxItems, roleId, 'again').then((t) => {
      const nextArray = commentsArray.concat(...t!);

      setCommentsArray(nextArray);
      if (t!.length === maxItems) {
        setLastVisible(t![t!.length - 1].postId!);
        setI(++i);
      }
    });
  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map((comment: CommentType, index) => (
          <DCProvider key={index}>
            <Comment commentData={{ ...comment, roleId }} />
          </DCProvider>
        ))
      ) : (
        <p className={styles.noComments}>{tComments('noComments')}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
    </>
  );
};
