import { useEffect, useState } from 'react';
import { getDoc, getDocs } from 'firebase/firestore';

import { AuthorType, CommentType } from 'types/global.types';

import { Comment } from 'components/atoms/Comment/Comment';
import { user } from '../../../references/referencesFirebase';

export const Comments = ({ refCom }: AuthorType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];

      const querySnapshot = await getDocs(refCom!);
      querySnapshot.forEach(async (document) => {
        const docSnap = await getDoc(user(document.data().author));
        if (docSnap.exists()) {
          commentArray.push({
            author: docSnap.data().pseudonym,
            date: `${new Date(document.data().date.nanoseconds).getDay()}.${new Date(document.data().date.nanoseconds).getMonth() + 1}.${new Date(document.data().date.nanoseconds).getFullYear()}`,
            description: document.data().message,
            idPost: document.id,
            nameGroup: document.data().nameGroup
          });
        }
      });
      setCommentsArray(commentArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refCom && showingComments();
  }, [refCom]);
  
  return <>
    {commentsArray.length > 0 ? commentsArray.map(({ author, date, description, idPost, nameGroup }: CommentType) =>
      <Comment key={idPost} date={date} description={description} nameGroup={nameGroup} author={author} idPost={idPost} />
    ) : <p>No comments</p>}
  </>;
};