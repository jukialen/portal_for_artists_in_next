import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CommentType } from 'types/global.types';

import { useGetDate } from 'helpers/useGetDate';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { LastComment } from 'components/atoms/LastComment/LastComment';
import { MoreButton } from '../../atoms/MoreButton/MoreButton';

export const LastComments = ({ userId, postId, commentId, subCommentId, groupSource }: CommentType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const maxItems = 5;

  const showingComments = async () => {
    try {
      //      const firstPage =

      const commentArray: CommentType[] = [];

      //          commentArray.push({
      //            author: docSnap.data().pseudonym,
      //            date: getDate(locale!, document.data().date),
      //            description: document.data().message,
      //            nameGroup: document.data().nameGroup,
      //            profilePhoto: docSnap.data().profilePhoto,
      //            idLastComment: document.id,
      //            likes: document.data().likes | 0,
      //            liked: document.data().liked || [],
      //            authorId: document.data().user,
      //          });

      setLastCommentsArray(commentArray);
      //      commentArray.length === maxItems &&
      //        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    showingComments();
  }, []);

  const nextShowingComments = async () => {
    try {
      //      const nextPage =

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

      const nextArray = lastCommentsArray.concat(...nextCommentArray);
      setLastCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {lastCommentsArray.length > 0 &&
        lastCommentsArray.map(
          (
            { author, date, comment, name, profilePhoto, likes, liked, lastCommentId, authorId }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <LastComment
                author={author}
                date={date}
                comment={comment}
                name={name}
                profilePhoto={profilePhoto}
                authorId={authorId}
                userId={userId!}
                postId={postId}
                commentId={commentId}
                subCommentId={subCommentId}
                likes={likes}
                liked={liked}
                lastCommentId={lastCommentId}
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && lastCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};
