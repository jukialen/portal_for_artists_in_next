import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDoc, getDocs } from 'firebase/firestore';

import { AuthorType, CommentType } from 'types/global.types';

import { docSubFilesComment, subLastFilesComments, user } from 'references/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { SubComment } from 'components/atoms/SubComment/SubComment';

export const SubComments = ({ refSubCom, userId, subCollection, idPost, idComment }: AuthorType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<CommentType[]>([]);
  
  const { locale } = useRouter();
  
  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];
      
      const documentSnapshots = await getDocs(refSubCom!);
      
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
            authorId: document.data().user
          });
        }
      };
      
      setSubCommentsArray(commentArray);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    !!refSubCom && showingComments();
  }, [refSubCom]);

  return <>
    {
      subCommentsArray.length > 0 && subCommentsArray.map(({
        author,
        date,
        description,
        nameGroup,
        profilePhoto,
        idSubComment,
        likes,
        liked,
        authorId
      }: CommentType, index) =>
        <SubComment
          key={index}
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
          refDocSubCom={docSubFilesComment(userId!, subCollection!, idPost!, idComment!, idSubComment!)}
          refLastCom={subLastFilesComments(userId!, subCollection!, idPost!, idComment!, idSubComment!)}
        />)
    }
  </>
};