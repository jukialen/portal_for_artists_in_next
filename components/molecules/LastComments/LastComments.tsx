import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';

import { docLastFilesComment, docLastPostsComments, user } from 'config/referencesFirebase';

import { AuthorType, CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { LastComment } from 'components/atoms/LastComment/LastComment';
import { MoreButton } from '../../atoms/MoreButton/MoreButton';

export const LastComments = ({
  userId,
  subCollection,
  idPost,
  idComment,
  idSubComment,
  refLastCom,
  groupSource,
}: AuthorType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const maxItems = 5;

  const showingComments = async () => {
    try {
      const firstPage = query(
        refLastCom!,
        orderBy('date', 'desc'),
        orderBy('user', 'desc'),
        orderBy('message', 'desc'),
        limit(maxItems),
      );
      const documentSnapshots = await getDocs(firstPage);

      const commentArray: CommentType[] = [];

      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().user));

        if (docSnap.exists()) {
          commentArray.push({
            author: docSnap.data().pseudonym,
            date: getDate(locale!, document.data().date),
            description: document.data().message,
            nameGroup: document.data().nameGroup,
            profilePhoto: docSnap.data().profilePhoto,
            idLastComment: document.id,
            likes: document.data().likes | 0,
            liked: document.data().liked || [],
            authorId: document.data().user,
          });
        }
      }
      setLastCommentsArray(commentArray);
      commentArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!refLastCom && showingComments();
  }, [refLastCom]);

  const nextShowingComments = async () => {
    try {
      const nextPage = query(
        refLastCom!,
        orderBy('date', 'desc'),
        orderBy('user', 'desc'),
        orderBy('message', 'desc'),
        limit(maxItems),
        startAfter(lastVisible),
      );
      const documentSnapshots = await getDocs(nextPage);

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      const nextCommentArray: CommentType[] = [];

      for (const document of documentSnapshots.docs) {
        const docSnap = await getDoc(user(document.data().user));

        if (docSnap.exists()) {
          nextCommentArray.push({
            author: docSnap.data().pseudonym,
            date: getDate(locale!, document.data().date),
            description: document.data().message,
            nameGroup: document.data().nameGroup,
            profilePhoto: docSnap.data().profilePhoto,
            idComment: document.id,
            likes: document.data().likes | 0,
            liked: document.data().liked || [],
            authorId: document.data().user,
          });
        }
      }
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
            {
              author,
              date,
              description,
              nameGroup,
              profilePhoto,
              likes,
              liked,
              idLastComment,
              authorId,
            }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <LastComment
                author={author}
                date={date}
                description={description}
                nameGroup={nameGroup}
                profilePhoto={profilePhoto}
                authorId={authorId}
                userId={userId!}
                subCollection={subCollection}
                idPost={idPost}
                idComment={idComment}
                idSubComment={idSubComment}
                likes={likes}
                liked={liked}
                idLastComment={idLastComment}
                refDocLastCom={
                  groupSource
                    ? docLastPostsComments(
                        nameGroup!,
                        idPost!,
                        idComment!,
                        idSubComment!,
                        idLastComment!,
                      )
                    : docLastFilesComment(
                        userId!,
                        subCollection!,
                        idPost!,
                        idComment!,
                        idSubComment!,
                        idLastComment!,
                      )
                }
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && lastCommentsArray.length === maxItems * i && (
        <MoreButton nextElements={nextShowingComments} />
      )}
    </>
  );
};
