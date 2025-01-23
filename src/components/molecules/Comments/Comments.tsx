'use client';

import { useEffect, useState } from 'react';

import { useCurrentLocale, useScopedI18n } from 'locales/client';

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

  const locale = useCurrentLocale();
  const tComments = useScopedI18n('Comments');
  const maxItems = 30;

  useEffect(() => {
    firstComments(locale, postId, maxItems, roleId).then((t) => {
      setCommentsArray(t!);
      t!.length === maxItems && setLastVisible(t![t!.length - 1].postId!);
    });
  }, []);

  const nextComments = () =>
    againComments(locale, postId, maxItems, roleId).then((t) => {
      const nextArray = commentsArray.concat(...t!);
      setCommentsArray(nextArray);
      setI(++i);
      t!.length === maxItems && setLastVisible(t![t!.length - 1].postId!);
    });
  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map(
          (
            {
              commentId,
              content,
              authorName,
              authorProfilePhoto,
              role,
              roleId,
              authorId,
              postId,
              date,
            }: CommentType,
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
