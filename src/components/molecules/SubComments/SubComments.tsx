import { useEffect, useState } from 'react';
import axios from 'axios';

import { SubCommentType } from 'types/global.types';

import { backUrl, cloudFrontUrl } from 'constants/links';

import { getDate } from 'helpers/getDate';

import { dateData } from 'helpers/dateData';

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

  const dataDateObject = dateData();

  const maxItems = 30;

  const params = encodeURI(JSON.stringify({
    fileCommentId,
    commentId,
    maxItems,
    cursor: lastVisible,
  }))
  const firstComments = async () => {
    try {
      const comments: SubCommentType[] = await fetch(`${backUrl}/api/sub-comments/${params}`, {
        method: 'GET',
      }).then(c => c.json());

      setSubCommentsArray(comments);
      comments.length === maxItems && setLastVisible(comments[comments.length - 1].createdAt);
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

      const comments: { data: SubCommentType[] } = await axios.get(`${backUrl}/sub-comments/all`, {
        params: {
          orderBy: 'createdAt, desc',
          where: fileCommentId ? { fileCommentId } : { commentId: commentId },
          limit: maxItems,
          cursor: lastVisible!,
        },
      });

      for (const _c of comments.data) {
        const { subCommentId, subComment, pseudonym, profilePhoto, role, roleId, authorId, createdAt, updatedAt } = _c;

        nextSubCommentsArray.push({
          subCommentId,
          subComment,
          pseudonym,
          profilePhoto,
          role,
          roleId,
          authorId,
          date: getDate(locale!, updatedAt! || createdAt!, await dataDateObject),
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
