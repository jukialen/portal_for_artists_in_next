import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';

import { AuthorType, CommentType } from 'types/global.types';

import {
  docFilesComments,
  docPostsComments,
  subFilesComments,
  subPostsComments,
  user
} from 'references/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { useHookSWR } from 'hooks/useHookSWR';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { Comment } from 'components/atoms/Comment/Comment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

import styles from './Comments.module.scss';

export const Comments = ({ userId, subCollection, refCom, idPost, groupSource }: AuthorType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>();
  let [i, setI] = useState(1);
  
  const { locale } = useRouter();
  const data = useHookSWR();
  const maxItems = 5;
  
  const showingComments = async () => {
    try {
      const firstPage = query(
        refCom!,
        orderBy('user', 'desc'), orderBy('message', 'desc'),
        limit(maxItems)
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
            idComment: document.id,
            likes: document.data().likes | 0,
            liked: document.data().liked || [],
            authorId: document.data().user
          });
        };
      };
      setCommentsArray(commentArray);
      commentArray.length === maxItems && setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refCom && showingComments();
  }, [refCom]);
  
  const nextShowingComments = async () => {
    try {
      const nextPage = query(
        refCom!,
        orderBy('user', 'desc'),
        orderBy('message', 'desc'),
        limit(maxItems),
        startAfter(lastVisible)
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
            authorId: document.data().user
          });
        };
      };
      
      const nextArray = commentsArray.concat(...nextCommentArray);
      setCommentsArray(nextArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    };
  };
  
  return <>
    {
      commentsArray.length > 0 ? commentsArray.map(({
          author,
          date,
          description,
          nameGroup,
          profilePhoto,
          idComment,
          likes,
          liked,
          authorId
        }: CommentType, index) =>
          <DCProvider key={index}>
            <Comment
              author={author}
              date={date}
              description={description}
              nameGroup={nameGroup}
              profilePhoto={profilePhoto}
              userId={userId!}
              subCollection={subCollection}
              idPost={idPost}
              idComment={idComment}
              likes={likes}
              liked={liked}
              authorId={authorId}
              refDocCom={
                groupSource ?
                docPostsComments(nameGroup!, idPost!, idComment!) :
                  docFilesComments(userId!, subCollection!, idPost!, idComment!)
              }
              refSubCom={
                groupSource ?
                  subPostsComments(nameGroup!, idPost!, idComment!) :
                  subFilesComments(userId!, subCollection!, idPost!, idComment!)
              }
              groupSource={groupSource}
            />
          </DCProvider>
      ) : <p className={styles.noComments}>{data?.Comments?.noComments}</p>
    }
    {
      !!lastVisible && commentsArray.length === maxItems * i
      && <MoreButton nextElements={nextShowingComments} />
    }
  </>
};