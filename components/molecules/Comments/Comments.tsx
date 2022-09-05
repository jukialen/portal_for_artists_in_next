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
  
  console.log('l', locale);
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];
      
      const documentSnapshots = await getDocs(refCom!);

      for (const document of documentSnapshots.docs) {
        console.log(document.id, ' => ', document.data());
        
        const docSnap = await getDoc(user(document.data().user));
        if (docSnap.exists()) {
          console.log('doc', docSnap.data());
          commentArray.push({
            author: docSnap.data().pseudonym,
            date: getDate(locale!, document.data().date),
            description: document.data().message,
            idPost: document.id,
            nameGroup: document.data().nameGroup,
            profilePhoto: docSnap.data().profilePhoto
          });
        }
      };
      console.log(commentArray)
      setCommentsArray(commentArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refCom && showingComments();
  }, [refCom]);
  
  return <>
    {commentsArray.length > 0 ? commentsArray.map(({ author, date, description, idPost, nameGroup, profilePhoto }: CommentType) =>
      <Comment key={idPost} date={date} description={description} nameGroup={nameGroup} author={author} idPost={idPost} profilePhoto={profilePhoto} />
    ) : <p className={styles.noComments}>{data?.Comments?.noComments}</p>}
  </>;
};