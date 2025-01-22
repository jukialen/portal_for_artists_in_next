'use client';

import { useEffect, useState } from 'react';

import { useCurrentLocale, useScopedI18n } from 'locales/client';

import { CommentType } from 'types/global.types';

import { againComments, firstComments } from 'utils/comments';

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
  const maxItems = 30;

  useEffect(() => {
    firstComments(locale, postId, maxItems).then((t) => {
      setCommentsArray(t!);
      t!.length === maxItems && setLastVisible(t![t!.length - 1].postId!);
    });
  }, []);

  const nextComments = () =>
    againComments(locale, postId, maxItems).then((t) => {
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
