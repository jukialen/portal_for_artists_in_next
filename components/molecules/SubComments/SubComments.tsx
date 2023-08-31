import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { SubCommentType } from 'types/global.types';

import { backUrl } from 'utilites/constants';

import { getDate } from 'helpers/getDate';

import { useDateData } from 'hooks/useDateData';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/atoms/SubComment/SubComment';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';

type SubCommentsType = {
  fileCommentId?: string;
  commentId?: string;
  fileId?: string;
  postId?: string;
  groupRoledId?: string;
};

export const SubComments = ({ fileCommentId, commentId, fileId, postId }: SubCommentsType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<SubCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const { locale } = useRouter();
  const dataDateObject = useDateData();

  const maxItems = 30;

  const firstComments = async () => {
    try {
      const commentArray: SubCommentType[] = [];

      const comments: SubCommentType[] = await axios.get(`${backUrl}/sub-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: !!fileCommentId ? { fileCommentId } : { commentId: commentId },
          limit: maxItems,
        },
      });

      for (const _c of comments) {
        const { subCommentId, subComment, pseudonym, profilePhoto, role, roleId, authorId, createdAt, updatedAt } = _c;

        commentArray.push({
          subCommentId,
          subComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          authorId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }
      setSubCommentsArray(commentArray);
      commentArray.length === maxItems &&
        setLastVisible(
          fileCommentId
            ? commentArray[commentArray.length - 1].fileCommentId
            : commentArray[commentArray.length - 1].commentId,
        );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!commentId && firstComments();
  }, [commentId]);

  const nextComments = async () => {
    try {
      const nextSubCommentsArray: SubCommentType[] = [];

      const comments: SubCommentType[] = await axios.get(`${backUrl}/sub-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: fileCommentId ? { fileCommentId } : { commentId: commentId },
          limit: maxItems,
          cursor: lastVisible!,
        },
      });

      for (const _c of comments) {
        const { subCommentId, subComment, pseudonym, profilePhoto, role, roleId, authorId, createdAt, updatedAt } = _c;

        nextSubCommentsArray.push({
          subCommentId,
          subComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          authorId,
          date: getDate(locale!, updatedAt! || createdAt!, dataDateObject),
        });
      }

      const nextArray = subCommentsArray.concat(...nextSubCommentsArray);
      setSubCommentsArray(nextArray);
      setI(++i);
      setLastVisible(
        fileCommentId ? nextArray[nextArray.length - 1].fileCommentId : nextArray[nextArray.length - 1].commentId,
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {subCommentsArray.length > 0 &&
        subCommentsArray.map(
          (
            { subCommentId, subComment, pseudonym, profilePhoto, role, roleId, authorId, date }: SubCommentType,
            index,
          ) => (
            <DCProvider key={index}>
              <SubComment
                subCommentId={subCommentId}
                subComment={subComment}
                pseudonym={pseudonym}
                profilePhoto={profilePhoto}
                role={role}
                roleId={roleId}
                authorId={authorId}
                fileCommentId={fileCommentId}
                fileId={fileId}
                postId={postId}
                //                likes={likes}
                //                liked={liked}
                date={date}
              />
            </DCProvider>
          ),
        )}
      {!!lastVisible && subCommentsArray.length === maxItems * i && <MoreButton nextElements={nextComments} />}
    </>
  );
};
