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

import { AuthorType, CommentType } from 'types/global.types';

import {
  docSubFilesComment,
  docSubPostsComments,
  lastPostsComments,
  subLastFilesComments,
  user,
} from 'config/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/atoms/SubComment/SubComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

export const SubComments = ({
  refSubCom,
  userId,
  subCollection,
  idPost,
  idComment,
  groupSource,
}: AuthorType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const maxItems = 30;

  const showingComments = async () => {
    try {
      const firstPage = query(
        refSubCom!,
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
            idSubComment: document.id,
            likes: document.data().likes | 0,
            liked: document.data().liked || [],
            authorId: document.data().user,
          });
        }
      }
      setSubCommentsArray(commentArray);
      commentArray.length === maxItems &&
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!refSubCom && showingComments();
  }, [refSubCom]);

  const nextShowingComments = async () => {
    try {
      const nextPage = query(
        refSubCom!,
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
            {
              author,
              date,
              description,
              nameGroup,
              profilePhoto,
              idSubComment,
              likes,
              liked,
              authorId,
            }: CommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <SubComment
                author={author}
                date={date}
                description={description}
                nameGroup={nameGroup}
                profilePhoto={profilePhoto}
                userId={userId!}
                subCollection={subCollection}
                idPost={idPost}
                idComment={idComment}
                idSubComment={idSubComment}
                likes={likes}
                liked={liked}
                authorId={authorId}
                refSubCom={refSubCom}
                refDocSubCom={
                  groupSource
                    ? docSubPostsComments(nameGroup!, idPost!, idComment!, idSubComment!)
                    : docSubFilesComment(
                        userId!,
                        subCollection!,
                        idPost!,
                        idComment!,
                        idSubComment!,
                      )
                }
                refLastCom={
                  groupSource
                    ? lastPostsComments(nameGroup!, idPost!, idComment!, idSubComment!)
                    : subLastFilesComments(
                        userId!,
                        subCollection!,
                        idPost!,
                        idComment!,
                        idSubComment!,
                      )
                }
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && subCommentsArray.length === maxItems * i && (
        <MoreButton nextElements={nextShowingComments} />
      )}
    </>
  );
};
