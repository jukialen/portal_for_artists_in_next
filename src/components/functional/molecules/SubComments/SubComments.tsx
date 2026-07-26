'use client';

import { useEffect, useState } from 'react';

import { SubCommentType } from 'types/global.types';

import { subComments } from 'utils/comments';

import { DCProvider } from 'providers/DeleteCommentProvider';

import { SubComment } from 'components/functional/atoms/SubComment/SubComment';
import { MoreButton } from 'components/ui/atoms/MoreButton/MoreButton';

type SubCommentsType = {
  fileCommentId?: string;
  commentId?: string;
  fileId?: string;
  postId?: string;
  groupsPostsRoleId?: string;
};

export const SubComments = ({ fileCommentId, commentId, fileId, postId, groupsPostsRoleId }: SubCommentsType) => {
  const [subCommentsArray, setSubCommentsArray] = useState<SubCommentType[]>([]);
  const [lastVisible, setLastVisible] = useState('');
  let [i, setI] = useState(1);

  const maxItems = 30;

  useEffect(() => {
    subComments('first', maxItems, commentId, fileCommentId).then((d) => {
      setSubCommentsArray(d);
      setLastVisible(d.at(-1)?.createdAt! || '');
    });
  }, [commentId, fileCommentId, groupsPostsRoleId]);

  const nextComments = async () => {
    lastVisible !== '' &&
      subComments('again', maxItems, commentId, fileCommentId, groupsPostsRoleId, lastVisible).then((t) => {
        const nextArray = subCommentsArray.concat(...t!);
        setSubCommentsArray(nextArray);
        if (t!.length === maxItems) {
          setLastVisible(t![t!.length - 1].commentId ? t![t!.length - 1].commentId! : t![t!.length - 1].fileCommentId!);
          setI((prev) => prev + 1);
        }
      });
  };

  return (
    <>
      {subCommentsArray.length > 0 &&
        subCommentsArray.map((subComments: SubCommentType, index) => (
          <DCProvider key={index}>
            <SubComment subCommentsData={{ ...subComments, fileCommentId, fileId, postId }} />
          </DCProvider>
        ))}
      {!!lastVisible && subCommentsArray.length === maxItems * i && <MoreButton nextElementsAction={nextComments} />}
    </>
  );
};
