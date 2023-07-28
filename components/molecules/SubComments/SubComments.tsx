import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/atoms/SubComment/SubComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

export const SubComments = ({ refSubCom, userId, subCollection, idPost, idComment, groupSource }: CommentType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const maxItems = 30;

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
      //            idSubComment: document.id,
      //            likes: document.data().likes | 0,
      //            liked: document.data().liked || [],
      //            authorId: document.data().user,
      //          });

      setSubCommentsArray(commentArray);
      //      commentArray.length === maxItems && setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!refSubCom && showingComments();
  }, [refSubCom]);

  const nextShowingComments = async () => {
    try {
      //      const nextPage

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

      const nextArray = subCommentsArray.concat(...nextCommentArray);
      setSubCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {subCommentsArray.length > 0 &&
        subCommentsArray.map(
          (
            { author, date, comment, nameGroup, profilePhoto, subCommentId, likes, liked, authorId }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <SubComment
                pseudonym={author}
                date={date}
                name={nameGroup}
                profilePhoto={profilePhoto}
                postId={idPost}
                commentId={idComment}
                comment={comment}
                subCommentId={subCommentId}
                likes={likes}
                liked={liked}
                authorId={authorId}
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && subCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};
