import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { CommentType } from 'types/global.types';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/atoms/SubComment/SubComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

export const SubComments = ({ refSubCom, userId, subCollection, idPost, idComment, groupSource }: AuthorType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<CommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const dataDateObject = useDateData();

  const maxItems = 30;

  const showingComments = async () => {
    try {
      const commentArray: CommentType[] = [];

      setSubCommentsArray(commentArray);
      //      commentArray.length === maxItems && setLastVisible();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!refSubCom && showingComments();
  }, [refSubCom]);

  const nextShowingComments = async () => {
    try {
      //      setLastVisible();

      const nextCommentArray: CommentType[] = [];

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
            { author, date, description, nameGroup, profilePhoto, idSubComment, likes, liked, authorId }: CommentType,
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
                    : docSubFilesComment(userId!, subCollection!, idPost!, idComment!, idSubComment!)
                }
                refLastCom={
                  groupSource
                    ? lastPostsComments(nameGroup!, idPost!, idComment!, idSubComment!)
                    : subLastFilesComments(userId!, subCollection!, idPost!, idComment!, idSubComment!)
                }
                groupSource={groupSource}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && subCommentsArray.length === maxItems * i && <MoreButton nextElements={nextShowingComments} />}
    </>
  );
};
