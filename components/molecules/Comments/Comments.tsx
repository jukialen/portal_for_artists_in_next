import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';
import { useHookSWR } from 'hooks/useHookSWR';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/atoms/Comment/Comment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Comments.module.scss';

export const Comments = ({ userId, postId, groupSource }: CommentType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const data = useHookSWR();
  const dataDateObject = useDateData();

  const maxItems = 30;

  const showingComments = async () => {
    try {
      //      const firstPage =

      const commentArray: CommentType[] = [];

      //          commentArray.push({
      //            author: docSnap.data().pseudonym,
      //            date: getDate(locale!, parseInt(`${post.updatedAt! || post.createdAt!}`), date),,
      //            description: document.data().message,
      //            nameGroup: document.data().nameGroup,
      //            profilePhoto: docSnap.data().profilePhoto,
      //            idComment: document.id,
      //            likes: document.data().likes | 0,
      //            liked: document.data().liked || [],
      //            authorId: document.data().user,
      //          });

      setCommentsArray(commentArray);
      //      commentArray.length === maxItems && setLa stVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    showingComments();
  }, []);

  const nextShowingComments = async () => {
    try {
      //      const nextPage = ;

      //      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      const nextCommentArray: CommentType[] = [];

      //          nextCommentArray.push({
      //            author: docSnap.data().pseudonym,
      //            date: getDate(locale!, document.data().date),
      //            description: document.data().message,
      //            nameGroup: document.data().nameGroup,
      //            profilePhoto: docSnap.data().profilePhoto,
      //            idComment: document.id,
      //            likes: document.data().likes | 0,
      //            liked: document.data().liked || [],
      //            authorId: document.data().user,
      //          });

      const nextArray = commentsArray.concat(...nextCommentArray);
      //      setCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {commentsArray.length > 0 ? (
        commentsArray.map(
          ({ author, date, comment, name, profilePhoto, commentId, likes, liked, authorId }: CommentType, index) => (
            <DCProvider key={index}>
              <Comment
                author={author}
                date={date}
                comment={comment}
                name={name}
                profilePhoto={profilePhoto}
                userId={userId!}
                postId={postId}
                commentId={commentId}
                likes={likes}
                liked={liked}
                authorId={authorId}
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )
      ) : (
        <p className={styles.noComments}>{data?.Comments?.noComments}</p>
      )}
      {!!lastVisible && commentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};
