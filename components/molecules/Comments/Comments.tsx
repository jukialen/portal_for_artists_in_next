import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { AuthorType, CommentType } from 'types/global.types';

import { docFilesComments, subFilesComments, user } from 'references/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { useHookSWR } from 'hooks/useHookSWR';

import { Comment } from 'components/atoms/Comment/Comment';

import styles from './Comments.module.scss';
import { DCProvider } from 'providers/DeleteCommentProvider';

export const Comments = ({ userId, subCollection, refCom, idPost }: AuthorType) => {
  const [commentsArray, setCommentsArray] = useState<CommentType[]>([]);
  
  const { locale } = useRouter();
  const data = useHookSWR();
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];
      
      const documentSnapshots = await getDocs(refCom!);

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
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refCom && showingComments();
  }, [refCom]);
  
  return <>
    {commentsArray.length > 0 ? commentsArray.map(({
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
          refDocCom={docFilesComments(userId!, subCollection!, idPost!, idComment!)}
          refSubCom={subFilesComments(userId!, subCollection!, idPost!, idComment!)}
        />
      </DCProvider>
    ) : <p className={styles.noComments}>{data?.Comments?.noComments}</p>}
  </>;
};