'use client';

import { useEffect, useState } from 'react';

import { useScopedI18n } from 'locales/client';

import { CommentType } from 'types/global.types';

import { againComments, firstComments } from 'utils/comments';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/atoms/Comment/Comment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Comments.module.scss';

type CommentsType = { postId: string; roleId: string };

export const Comments = ({ postId, roleId }: CommentsType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    firstComments(postId, maxItems, roleId).then((t) => {
      setCommentsArray(t!);
      !!t && t.length === maxItems && setLastVisible(t[t.length - 1].postId!);
    });
  }, [postId, roleId]);

  const nextComments = () =>
    lastVisible !== '' &&
    againComments(postId, maxItems, roleId).then((t) => {
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
        commentsArray.map(
          (
            { commentId, content, authorName, authorProfilePhoto, role, roleId, authorId, postId, date }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <Comment
                commentId={commentId}
                content={content}
                authorName={authorName}
                authorProfilePhoto={authorProfilePhoto}
                role={role}
                roleId={roleId}
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
