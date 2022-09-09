import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { docLastFilesComment, user } from 'references/referencesFirebase';

import { AuthorType, CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { LastComment } from 'components/atoms/LastComment/LastComment';

export const LastComments = ({ userId, subCollection, idPost, idComment, idSubComment, refLastCom }: AuthorType) => {
  const [lastCommentsArray, setLastCommentsArray] = useState<CommentType[]>([]);
  
  const { locale } = useRouter();
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];
      
      const documentSnapshots = await getDocs(refLastCom!);
      
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
            authorId: document.data().user
          });
        }
      };
      
      setLastCommentsArray(commentArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refLastCom && showingComments();
  }, [refLastCom]);
  
  return <>
    {
      lastCommentsArray.length > 0 && lastCommentsArray.map(({
        author,
        date,
        description,
        nameGroup,
        profilePhoto,
        idSubComment,
        likes,
        liked,
        idLastComment,
        authorId
    }: CommentType, index) =>
        <LastComment
          key={index}
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
          refDocLastCom={docLastFilesComment(userId!, subCollection!, idPost!, idComment!, idSubComment!, idLastComment!)}
        />)
    }
  </>
}