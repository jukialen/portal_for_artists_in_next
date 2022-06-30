import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc, getDocs } from 'firebase/firestore';

import { comments } from 'references/referencesFirebase';

import { AuthorType, CommentType } from 'types/global.types';

import { Comment } from 'components/atoms/Comment/Comment';

export const Comments = ({ name, refCom }: AuthorType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];
      // @ts-ignore
      const querySnapshot = await getDocs(refCom);
      querySnapshot.forEach(async (document) => {
        const docRef = doc(db, `users/${document.data().author}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          commentArray.push({
            author: docSnap.data().pseudonym,
            date: `${new Date(document.data().date.nanoseconds).getDay()}.${new Date(document.data().date.nanoseconds).getMonth() + 1}.${new Date(document.data().date.nanoseconds).getFullYear()}`,
            description: document.data().message,
            idPost: document.id,
            name: document.data().nameGroup
          });
        }
      });
      console.log(commentArray);
      setCommentsArray(commentArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!name && showingComments();
  }, [name, comments]);
  
  return <>
    {console.log(commentsArray)}
    {commentsArray.length > 0 ? commentsArray.map(({ author, date, description, idPost, name }: CommentType) =>
      <Comment key={idPost} date={date} description={description} name={name} author={author} idPost={idPost} />
    ) : <p>No comments</p>}
  </>;
};