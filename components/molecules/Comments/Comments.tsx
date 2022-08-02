import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { AuthorType, CommentType } from 'types/global.types';

import { user } from 'references/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { useHookSWR } from 'hooks/useHookSWR';

import { Comment } from 'components/atoms/Comment/Comment';

import styles from './Comments.module.scss';

export const Comments = ({ refCom }: AuthorType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  
  const { locale } = useRouter();
  const data = useHookSWR();
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];

      const querySnapshot = await getDocs(refCom!);
      querySnapshot.forEach(async (document) => {
        const docSnap = await getDoc(user(document.data().author));
        if (docSnap.exists()) {
          commentArray.push({
            author: docSnap.data().pseudonym,
            date: getDate(locale!, document.data().date),
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
    ) : <p className={styles.noComments}>{data?.Comments?.noComments}</p>}
  </>;
};